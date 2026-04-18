import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'https://narba.onrender.com';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log('Fetch error:', error);
      Alert.alert('Error', 'Unable to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter task title');
      return;
    }

    try {
      if (editingId !== null) {
        const response = await fetch(`${API_URL}/tasks/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({title}),
        });

        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Error', data.message || 'Update failed');
          return;
        }

        setEditingId(null);
        setTitle('');
        fetchTasks();
      } else {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({title}),
        });

        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Error', data.message || 'Create failed');
          return;
        }

        setTitle('');
        fetchTasks();
      }
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEdit = task => {
    setTitle(task.title);
    setEditingId(task.id);
  };

  const handleDelete = async id => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Delete failed');
        return;
      }

      fetchTasks();
    } catch (error) {
      console.log('Delete error:', error);
      Alert.alert('Error', 'Unable to delete task');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskText}>{item.title}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => handleEdit(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.heading}>Task CRUD App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task title"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.addBtn} onPress={handleAddOrUpdate}>
        <Text style={styles.btnText}>
          {editingId !== null ? 'Update Task' : 'Add Task'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  taskText: {
    fontSize: 17,
    color: '#222',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  editBtn: {
    backgroundColor: 'green',
  },
  deleteBtn: {
    backgroundColor: 'red',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});