import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CommunityCommentsScreen({ route, navigation }) {
  const { postId, postName, postText } = route.params;

  const COMMENTS_KEY = `legacyWalk_comments_${postId}`;

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const saved = await AsyncStorage.getItem(COMMENTS_KEY);
      if (saved) setComments(JSON.parse(saved));
    } catch (error) {
      console.log("Load comments error:", error);
    }
  };

  const saveComments = async (updatedComments) => {
    try {
      await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
    } catch (error) {
      console.log("Save comments error:", error);
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) {
      Alert.alert("Empty Comment", "Please write a comment first.");
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      name: "You",
      text: comment.trim(),
      time: "Just now",
    };

    const updatedComments = [newComment, ...comments];

    setComments(updatedComments);
    setComment("");
    await saveComments(updatedComments);
  };

  const deleteComment = async (id) => {
    const updatedComments = comments.filter((item) => item.id !== id);
    setComments(updatedComments);
    await saveComments(updatedComments);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.small}>COMMENTS</Text>
      <Text style={styles.title}>{postName}</Text>

      <View style={styles.postBox}>
        <Text style={styles.postText}>{postText}</Text>
      </View>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#7F8DA3"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <TouchableOpacity style={styles.postButton} onPress={submitComment}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No comments yet. Be the first.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View style={styles.commentTop}>
              <Text style={styles.commentName}>{item.name}</Text>

              <TouchableOpacity onPress={() => deleteComment(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
    padding: 18,
  },
  back: {
    color: "#D8A72E",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 20,
  },
  small: {
    color: "#D8A72E",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 5,
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 18,
  },
  postBox: {
    backgroundColor: "#111318",
    borderColor: "#1F2A3D",
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  postText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 30,
  },
  inputBox: {
    backgroundColor: "#111318",
    borderColor: "#D8A72E",
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    marginBottom: 20,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 18,
    minHeight: 80,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: "#D8A72E",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  postButtonText: {
    color: "#05070C",
    fontSize: 17,
    fontWeight: "900",
  },
  empty: {
    color: "#8FA1B8",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 30,
  },
  commentCard: {
    backgroundColor: "#111318",
    borderColor: "#1F2A3D",
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  commentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentName: {
    color: "#D8A72E",
    fontSize: 18,
    fontWeight: "900",
  },
  delete: {
    color: "#FF5C5C",
    fontSize: 14,
    fontWeight: "900",
  },
  commentText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
  },
  time: {
    color: "#8FA1B8",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
  },
});