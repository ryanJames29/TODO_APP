import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

//Todo type
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  status: "incomplete" | "in-progress" | "complete";
  email: string;
};

//used to sort the status of the todo items, 0 being highest priority (top)
const sortOrder: Record<Todo["status"], number> = {
  "incomplete": 0,
  "in-progress": 1,
  "complete": 2
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
        status: "incomplete",
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

  //updates the todo objects status stored in Asynch storage.
  const updateTodoStatus = async (id: number, newStatus: "incomplete" | "in-progress" | "complete") => {
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      );
      setTodos(updatedTodos);
  
      const allTodos = await fetchTodos();
      const updatedAllTodos = allTodos.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      );
  
      await AsyncStorage.setItem("todos", JSON.stringify(updatedAllTodos));
    } catch (error) {
      console.error("Error updating todo status:", error);
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
        placeholderTextColor="black"
        value={newTodo}
        onChangeText={setNewTodo}
      />

      <Button title="Add" onPress={addTodo} />

      <FlatList
        data={[...todos].sort((a, b) => sortOrder[a.status] - sortOrder[b.status])}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            {/* Task Name on the Left */}
            <Text style={styles.todoText}>{item.text}</Text>

            {/* Status Selection on the Right */}
            <View style={styles.statusContainer}>
              {/* When the emoji is selected, it updates the status and stores it */}
              <TouchableOpacity onPress={() => updateTodoStatus(item.id, "incomplete")}>
                <Text style={[styles.statusIcon, item.status === "incomplete" ? styles.selected : styles.unselected]}>
                  ❌
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => updateTodoStatus(item.id, "in-progress")}>
                <Text style={[styles.statusIcon, item.status === "in-progress" ? styles.selected : styles.unselected]}>
                  🔄
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => updateTodoStatus(item.id, "complete")}>
                <Text style={[styles.statusIcon, item.status === "complete" ? styles.selected : styles.unselected]}>
                  ✔️
                </Text>
              </TouchableOpacity>
            </View>

            {/* Delete Button - May want to change this with the addition of the ❌ */}
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
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  container: { 
    flex: 1,  
    paddingLeft: 30, 
    paddingRight: 30,
    backgroundColor: "white",
  },  
  title: { 
    fontSize: 35, 
    marginBottom: 20, 
    marginTop: 50,
    fontWeight: "bold", 
    textAlign: "center",
    fontFamily: "Courier New"
  },
  input: { 
    width: "100%", 
    padding: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderRadius: 5,
    color: "black",
    fontSize: 16,
    fontFamily: "Courier New",
    fontWeight: "bold"
  },
  todoContainer: { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, 
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  todoText: { 
    fontSize: 18,
    color: "black",
    flex: 1,
    fontFamily: "Courier New",
    fontWeight: "bold"
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: { 
    fontSize: 24,
    marginHorizontal: 8,
  },
  selected: {
    opacity: 1,
  },
  unselected: {
    opacity: 0.1,
  },
  deleteButton: { 
    padding: 10, 
    marginLeft: 10,
  },
  deleteText: { 
    fontSize: 25, 
    color: "red",
  },
});  

export default TodoListScreen;
