import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Todo type
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    //need to change this so it is user specific todo items (user.savedTodos).
    const loadTodos = async () => {
      const savedTodos = await AsyncStorage.getItem("todos");
      if (savedTodos) setTodos(JSON.parse(savedTodos));
    };
    loadTodos();
  }, []);

  //need to add other information, such as prioroty (possibly), but at least sort between completed/incomplete items.
  const addTodo = async () => {
    const updatedTodos: Todo[] = [...todos, { id: Date.now(), text: newTodo, completed: false }];
    setTodos(updatedTodos);
    await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    setNewTodo("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput placeholder="New Task" style={styles.input} value={newTodo} onChangeText={setNewTodo} />
      <Button title="Add" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.todoItem}>{item.text}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: "80%", padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5 },
  todoItem: { fontSize: 18, padding: 10, borderBottomWidth: 1 },
});