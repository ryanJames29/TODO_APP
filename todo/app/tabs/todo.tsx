import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Todo type
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  status: "incomplete" | "in-progress" | "complete";
  email: string;
  category: "school" | "work" | "personal";
};

//used to sort the status of the todo items, 0 being highest priority (top)
const sortOrder: Record<Todo["status"], number> = {
  "incomplete": 0,
  "in-progress": 1,
  "complete": 2
};

//Function to get the logged-in user's email
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
  const [name, setName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"school" | "work" | "personal">("personal");

  const categories: Array<"school" | "work" | "personal"> = ["school", "work", "personal"];

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
        category: selectedCategory,
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

  //used to set the name for the user within the todo screen
  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem("loggedInUser_name");
      setName(storedName);
    };
    fetchName();
  }, []);

  const groupedTodos = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  Object.keys(groupedTodos).forEach((category) => {
    groupedTodos[category].sort((a, b) => sortOrder[a.status] - sortOrder[b.status]);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}'s To-Do List</Text>

      <TextInput
        placeholder="New Task"
        style={styles.input}
        placeholderTextColor="black"
        value={newTodo}
        onChangeText={setNewTodo}
      />

      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category ? styles.categorySelected : styles.categoryUnselected
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* <Button title="Add" onPress={addTodo} /> */}
      <TouchableOpacity style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <FlatList
        data={Object.keys(groupedTodos)}
        keyExtractor={(category) => category}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item: category }) => (
          <View>
            <Text style={styles.categoryHeader}>
              *** {category.toUpperCase()} ***
            </Text>

            {groupedTodos[category].map((todo) => (
              <View key={todo.id} style={styles.todoContainer}>
                <Text style={styles.todoText}>{todo.text}</Text>

                {/* Status Selection */}
                <View style={styles.statusContainer}>
                  <TouchableOpacity onPress={() => updateTodoStatus(todo.id, "incomplete")}>
                    <Text style={[styles.statusIcon, todo.status === "incomplete" ? styles.selected : styles.unselected]}>
                      ❌
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => updateTodoStatus(todo.id, "in-progress")}>
                    <Text style={[styles.statusIcon, todo.status === "in-progress" ? styles.selected : styles.unselected]}>
                      🔄
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => updateTodoStatus(todo.id, "complete")}>
                    <Text style={[styles.statusIcon, todo.status === "complete" ? styles.selected : styles.unselected]}>
                      ✔️
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => deleteTodo(todo.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.separator} />
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
    paddingBottom: 80,
    backgroundColor: "white",
  },  
  title: { 
    fontSize: 35, 
    marginBottom: 20, 
    marginTop: 50,
    fontWeight: "bold", 
    textAlign: "center",
    fontFamily: "Courier"
  },
  input: { 
    width: "100%", 
    padding: 10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderRadius: 5,
    color: "black",
    fontSize: 18,
    fontFamily: "Courier",
    fontWeight: "bold"
  },
  categoryContainer: {  
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  categoryButton: {  
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 80,
    alignItems: "center",
  },
  categorySelected: {  
    backgroundColor: "#007AFF",
  },
  categoryUnselected: {  
    backgroundColor: "#E0E0E0",
  },
  categoryText: {  
    color: "white",
    fontWeight: "bold",
    fontFamily: "Courier",
    fontSize: 18
  },
  todoContainer: { 
    paddingVertical: 10, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  todoText: { 
    fontSize: 18,
    color: "black",
    fontFamily: "Courier",
    fontWeight: "bold"
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  statusIcon: { 
    fontSize: 24,
    padding: 5,
    borderRadius: 5, 
    textAlign: "center",
  },
  selected: {
    opacity: 1,
  },
  unselected: {
    opacity: 0.3,
  },
  deleteButton: {  
    padding: 10,  
    borderRadius: 8,
    alignItems: "center",  
    backgroundColor: "red",  
    marginTop: 10,
  },
  deleteText: {  
    fontSize: 18,  
    color: "white",  
    fontWeight: "bold",  
    fontFamily: "Courier",
  },
  addButton: {
    paddingVertical: 12,  
    paddingHorizontal: 20,  
    borderRadius: 8,
    alignItems: "center",  
    justifyContent: "center",  
    backgroundColor: "#007AFF",
    marginBottom: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {  
    fontSize: 18,  
    fontWeight: "bold",  
    color: "white",  
    textTransform: "uppercase",
    fontFamily: "Courier",
  },  
  categoryHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "Courier",
  },
  separator: {
    height: 1,
    marginVertical: 5,
  },
});

export default TodoListScreen;
