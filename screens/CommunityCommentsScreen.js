import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";


// ============================================================
// LEGATHON WALK
// COMMUNITY COMMENTS
// ============================================================

export default function CommunityCommentsScreen({
  route,
  navigation,

  post = null,

  goBack,

  userName = "You",
}) {

  // ==========================================================
  // POST DATA
  // ==========================================================

  const routeParams =
    route?.params ||
    {};


  const postId =
    post?.id ||
    routeParams?.postId ||
    "community-post";


  const postName =
    post?.name ||
    routeParams?.postName ||
    "Legathon Community";


  const postText =
    post?.text ||
    post?.activity ||
    routeParams?.postText ||
    "";


  const postJourney =
    post?.journey ||
    routeParams?.postJourney ||
    "";


  // ==========================================================
  // STORAGE
  // ==========================================================

  const COMMENTS_KEY =
    useMemo(
      () =>
        `legathon_comments_${postId}`,
      [postId]
    );


  // ==========================================================
  // STATE
  // ==========================================================

  const [comment, setComment] =
    useState("");

  const [comments, setComments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [posting, setPosting] =
    useState(false);


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack =
    useCallback(() => {

      if (
        typeof goBack ===
        "function"
      ) {

        goBack();

        return;
      }


      if (
        navigation?.goBack
      ) {

        navigation.goBack();
      }

    }, [
      goBack,
      navigation,
    ]);


  // ==========================================================
  // LOAD COMMENTS
  // ==========================================================

  const loadComments =
    useCallback(async () => {

      try {

        setLoading(true);


        const saved =
          await AsyncStorage
            .getItem(
              COMMENTS_KEY
            );


        if (!saved) {

          setComments([]);

          return;
        }


        const parsed =
          JSON.parse(saved);


        if (
          !Array.isArray(parsed)
        ) {

          throw new Error(
            "Saved comments are invalid."
          );
        }


        setComments(
          parsed
        );

      } catch (error) {

        console.log(
          "Load comments error:",
          error
        );


        setComments([]);

      } finally {

        setLoading(false);
      }

    }, [
      COMMENTS_KEY,
    ]);


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadComments();

  }, [
    loadComments,
  ]);


  // ==========================================================
  // SAVE COMMENTS
  // ==========================================================

  const saveComments =
    async (
      updatedComments
    ) => {

      await AsyncStorage
        .setItem(
          COMMENTS_KEY,

          JSON.stringify(
            updatedComments
          )
        );
    };


  // ==========================================================
  // SUBMIT COMMENT
  // ==========================================================

  const submitComment =
    async () => {

      const cleanComment =
        comment.trim();


      if (!cleanComment) {

        Alert.alert(
          "Empty Comment",
          "Please write a comment first."
        );

        return;
      }


      if (
        posting
      ) {

        return;
      }


      setPosting(true);


      const newComment = {

        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

        name:
          userName ||
          "You",

        text:
          cleanComment,

        createdAt:
          new Date()
            .toISOString(),
      };


      const updatedComments = [

        newComment,

        ...comments,

      ];


      try {

        await saveComments(
          updatedComments
        );


        setComments(
          updatedComments
        );


        setComment("");

      } catch (error) {

        console.log(
          "Save comment error:",
          error
        );


        Alert.alert(
          "Unable to Post",
          "Your comment could not be saved. Please try again."
        );

      } finally {

        setPosting(false);
      }
    };


  // ==========================================================
  // DELETE COMMENT
  // ==========================================================

  const deleteComment =
    (
      id
    ) => {

      Alert.alert(
        "Delete Comment?",
        "This comment will be removed.",
        [
          {
            text:
              "Cancel",

            style:
              "cancel",
          },

          {
            text:
              "Delete",

            style:
              "destructive",

            onPress:
              async () => {

                try {

                  const updatedComments =
                    comments.filter(
                      item =>
                        item.id !==
                        id
                    );


                  await saveComments(
                    updatedComments
                  );


                  setComments(
                    updatedComments
                  );

                } catch (error) {

                  console.log(
                    "Delete comment error:",
                    error
                  );


                  Alert.alert(
                    "Unable to Delete",
                    "Please try again."
                  );
                }
              },
          },
        ]
      );
    };


  // ==========================================================
  // COMMENT TIME
  // ==========================================================

  const getCommentTime =
    (
      createdAt
    ) => {

      if (!createdAt) {

        return "";
      }


      const created =
        new Date(
          createdAt
        );


      if (
        Number.isNaN(
          created.getTime()
        )
      ) {

        return "";
      }


      const difference =
        Date.now() -
        created.getTime();


      const minutes =
        Math.floor(
          difference /
          60000
        );


      if (
        minutes <
        1
      ) {

        return "Just now";
      }


      if (
        minutes <
        60
      ) {

        return `${minutes}m ago`;
      }


      const hours =
        Math.floor(
          minutes /
          60
        );


      if (
        hours <
        24
      ) {

        return `${hours}h ago`;
      }


      const days =
        Math.floor(
          hours /
          24
        );


      if (
        days <
        7
      ) {

        return `${days}d ago`;
      }


      return created
        .toLocaleDateString();
    };


  // ==========================================================
  // RENDER COMMENT
  // ==========================================================

  const renderComment =
    ({
      item,
    }) => {

      return (

        <View
          style={
            styles.commentCard
          }
        >

          <View
            style={
              styles.commentTop
            }
          >

            <View>

              <Text
                style={
                  styles.commentName
                }
              >

                {item.name ||
                  "Legathon Walker"}

              </Text>


              <Text
                style={
                  styles.time
                }
              >

                {getCommentTime(
                  item.createdAt
                )}

              </Text>

            </View>


            <TouchableOpacity
              onPress={() =>
                deleteComment(
                  item.id
                )
              }
            >

              <Text
                style={
                  styles.delete
                }
              >

                Delete

              </Text>

            </TouchableOpacity>

          </View>


          <Text
            style={
              styles.commentText
            }
          >

            {item.text}

          </Text>

        </View>
      );
    };


  // ==========================================================
  // SCREEN
  // ==========================================================

  return (

    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <KeyboardAvoidingView
        style={
          styles.container
        }
        behavior={
          Platform.OS ===
          "ios"
            ? "padding"
            : undefined
        }
      >

        <TouchableOpacity
          onPress={
            handleBack
          }
          style={
            styles.backButton
          }
        >

          <Text
            style={
              styles.back
            }
          >

            ‹ Back

          </Text>

        </TouchableOpacity>


        <Text
          style={
            styles.brand
          }
        >

          LEGATHON WALK

        </Text>


        <Text
          style={
            styles.small
          }
        >

          COMMUNITY COMMENTS

        </Text>


        <Text
          style={
            styles.title
          }
        >

          {postName}

        </Text>


        <View
          style={
            styles.postBox
          }
        >

          {!!postText && (

            <Text
              style={
                styles.postText
              }
            >

              {postText}

            </Text>

          )}


          {!!postJourney && (

            <View
              style={
                styles.journeyBox
              }
            >

              <Text
                style={
                  styles.journeyLabel
                }
              >

                JOURNEY

              </Text>


              <Text
                style={
                  styles.journeyText
                }
              >

                {postJourney}

              </Text>

            </View>

          )}

        </View>


        <View
          style={
            styles.inputBox
          }
        >

          <TextInput
            style={
              styles.input
            }

            placeholder=
              "Write a comment..."

            placeholderTextColor=
              "#7F8DA3"

            value={
              comment
            }

            onChangeText={
              setComment
            }

            multiline

            maxLength={
              500
            }
          />


          <View
            style={
              styles.inputFooter
            }
          >

            <Text
              style={
                styles.characterCount
              }
            >

              {comment.length}/500

            </Text>


            <TouchableOpacity
              style={[
                styles.postButton,

                (
                  !comment.trim() ||
                  posting
                ) &&
                  styles.postButtonDisabled,
              ]}
              onPress={
                submitComment
              }
              disabled={
                !comment.trim() ||
                posting
              }
            >

              <Text
                style={
                  styles.postButtonText
                }
              >

                {posting
                  ? "Posting..."
                  : "Post"}

              </Text>

            </TouchableOpacity>

          </View>

        </View>


        <View
          style={
            styles.commentHeader
          }
        >

          <Text
            style={
              styles.commentHeaderTitle
            }
          >

            Comments

          </Text>


          <Text
            style={
              styles.commentCount
            }
          >

            {comments.length}

          </Text>

        </View>


        <FlatList
          data={
            comments
          }

          keyExtractor={
            item =>
              String(
                item.id
              )
          }

          renderItem={
            renderComment
          }

          keyboardShouldPersistTaps=
            "handled"

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={
            styles.listContent
          }

          ListEmptyComponent={

            <Text
              style={
                styles.empty
              }
            >

              {loading
                ? "Loading comments..."
                : "No comments yet. Be the first."}

            </Text>
          }
        />

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles =
  StyleSheet.create({

    safeArea: {

      flex: 1,

      backgroundColor:
        "#05070C",
    },


    container: {

      flex: 1,

      backgroundColor:
        "#05070C",

      paddingHorizontal:
        18,
    },


    backButton: {

      alignSelf:
        "flex-start",

      paddingVertical:
        10,

      paddingRight:
        20,
    },


    back: {

      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    brand: {

      color:
        "#D8A72E",

      fontSize:
        13,

      fontWeight:
        "900",

      letterSpacing:
        2,

      marginTop:
        8,
    },


    small: {

      color:
        "#8FA1B8",

      fontSize:
        11,

      fontWeight:
        "900",

      letterSpacing:
        3,

      marginTop:
        8,

      marginBottom:
        7,
    },


    title: {

      color:
        "#FFFFFF",

      fontSize:
        34,

      fontWeight:
        "900",

      marginBottom:
        18,
    },


    postBox: {

      backgroundColor:
        "#111318",

      borderColor:
        "#1F2A3D",

      borderWidth:
        1,

      borderRadius:
        24,

      padding:
        18,

      marginBottom:
        18,
    },


    postText: {

      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "700",

      lineHeight:
        27,
    },


    journeyBox: {

      backgroundColor:
        "#0A101B",

      borderRadius:
        14,

      padding:
        12,

      marginTop:
        14,
    },


    journeyLabel: {

      color:
        "#7F8DA3",

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        1.2,
    },


    journeyText: {

      color:
        "#D8A72E",

      fontSize:
        14,

      fontWeight:
        "900",

      marginTop:
        3,
    },


    inputBox: {

      backgroundColor:
        "#111318",

      borderColor:
        "#D8A72E",

      borderWidth:
        1,

      borderRadius:
        22,

      padding:
        14,

      marginBottom:
        18,
    },


    input: {

      color:
        "#FFFFFF",

      fontSize:
        17,

      minHeight:
        70,

      maxHeight:
        130,

      textAlignVertical:
        "top",
    },


    inputFooter: {

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginTop:
        10,
    },


    characterCount: {

      color:
        "#7F8DA3",

      fontSize:
        12,

      fontWeight:
        "700",
    },


    postButton: {

      backgroundColor:
        "#D8A72E",

      borderRadius:
        999,

      paddingVertical:
        11,

      paddingHorizontal:
        28,

      alignItems:
        "center",
    },


    postButtonDisabled: {

      opacity:
        0.45,
    },


    postButtonText: {

      color:
        "#05070C",

      fontSize:
        15,

      fontWeight:
        "900",
    },


    commentHeader: {

      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom:
        12,
    },


    commentHeaderTitle: {

      color:
        "#FFFFFF",

      fontSize:
        21,

      fontWeight:
        "900",
    },


    commentCount: {

      color:
        "#05070C",

      backgroundColor:
        "#D8A72E",

      minWidth:
        25,

      height:
        25,

      borderRadius:
        13,

      overflow:
        "hidden",

      textAlign:
        "center",

      lineHeight:
        25,

      fontSize:
        12,

      fontWeight:
        "900",

      marginLeft:
        9,
    },


    listContent: {

      paddingBottom:
        120,
    },


    empty: {

      color:
        "#8FA1B8",

      fontSize:
        16,

      fontWeight:
        "800",

      textAlign:
        "center",

      marginTop:
        30,
    },


    commentCard: {

      backgroundColor:
        "#111318",

      borderColor:
        "#1F2A3D",

      borderWidth:
        1,

      borderRadius:
        22,

      padding:
        18,

      marginBottom:
        14,
    },


    commentTop: {

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",

      marginBottom:
        10,
    },


    commentName: {

      color:
        "#D8A72E",

      fontSize:
        17,

      fontWeight:
        "900",
    },


    delete: {

      color:
        "#FF5C5C",

      fontSize:
        13,

      fontWeight:
        "900",
    },


    commentText: {

      color:
        "#FFFFFF",

      fontSize:
        17,

      fontWeight:
        "700",

      lineHeight:
        26,
    },


    time: {

      color:
        "#8FA1B8",

      fontSize:
        12,

      fontWeight:
        "700",

      marginTop:
        3,
    },
  });