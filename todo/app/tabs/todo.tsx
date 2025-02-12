import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Todo type
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  email: string;
};

//Function to get the logged-in user's email - important since the todos are associated with email as of now.
const getUserEmail = async (): Promise<string | null> => {
  try {
    const email = await AsyncStorage.getItem("loggedInUserEmail");
    return email || null;
  } catch (error) {
    console.error("Error retrieving user email:", error);
    return null;
  }
};

//Function to fetch todos from storage
const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const todos = await AsyncStorage.getItem("todos");
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

//Function to filter todos by logged-in user
const getUserTodos = async (): Promise<Todo[]> => {
  const email = await getUserEmail();
  if (!email) return [];
  const todos = await fetchTodos();
  return todos.filter(todo => todo.email === email);
};

const TodoListScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  //Load todos on mount
  useEffect(() => {
    const loadTodos = async () => {
      const userTodos = await getUserTodos();
      setTodos(userTodos);
    };
    loadTodos();
  }, []);

  //Add a new to-do
  const addTodo = async () => {
    try {
      const userEmail = await getUserEmail();
      if (!userEmail) {
        Alert.alert("Error", "No logged-in user found.");
        return;
      }

      if (newTodo.trim() === "") {
        Alert.alert("Error", "Task cannot be empty.");
        return;
      }

      const newItem: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        email: userEmail,
      };

      const updatedTodos = [...todos, newItem];
      setTodos(updatedTodos);

      const allTodos = await fetchTodos();
      const updatedAllTodos = [...allTodos, newItem];

      await AsyncStorage.setItem("todos", JSON.stringify(updatedAllTodos));
      setNewTodo("");
    } catch (error) {
      console.error("Error adding a new todo:", error);
    }
  };

  //Toggle task completion
  const toggleComplete = async (id: number) => {
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);

      const allTodos = await fetchTodos();
      const updatedAllTodos = allTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      await AsyncStorage.setItem("todos", JSON.stringify(updatedAllTodos));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  //Delete a task
  const deleteTodo = async (id: number) => {
    try {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);

      const allTodos = await fetchTodos();
      const updatedAllTodos = allTodos.filter(todo => todo.id !== id);

      await AsyncStorage.setItem("todos", JSON.stringify(updatedAllTodos));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TextInput
        placeholder="New Task"
        style={styles.input}
        value={newTodo}
        onChangeText={setNewTodo}
      />

      <Button title="Add" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <TouchableOpacity 
              onPress={() => toggleComplete(item.id)} 
              style={styles.todoTextContainer}
            >
              <Text style={[styles.todoText, item.completed && styles.completed]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

//UI Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "white" 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  input: { 
    width: "100%", 
    padding: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderRadius: 5 
  },
  todoContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: 10, 
    borderBottomWidth: 1 
  },
  todoTextContainer: { 
    flex: 1 
  },
  todoText: { 
    fontSize: 18 
  },
  completed: { 
    textDecorationLine: "line-through", 
    color: "gray" 
  },
  deleteButton: { 
    padding: 5 
  },
  deleteText: { 
    fontSize: 20, 
    color: "red" 
  },
});

export default TodoListScreen;
