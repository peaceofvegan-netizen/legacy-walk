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

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    brand: "LEGATHON WALK",
    communityComments: "COMMUNITY COMMENTS",
    back: "‹ Back",
    journey: "JOURNEY",

    writeComment: "Write a comment...",
    post: "Post",
    posting: "Posting...",

    comments: "Comments",
    loadingComments: "Loading comments...",
    noComments: "No comments yet. Be the first.",

    delete: "Delete",
    deleteCommentTitle: "Delete Comment?",
    deleteCommentMessage: "This comment will be removed.",
    cancel: "Cancel",

    emptyCommentTitle: "Empty Comment",
    emptyCommentMessage: "Please write a comment first.",

    unableToPost: "Unable to Post",
    unableToPostMessage:
      "Your comment could not be saved. Please try again.",

    unableToDelete: "Unable to Delete",
    tryAgain: "Please try again.",

    legathonWalker: "Legathon Walker",
    you: "You",

    invalidSavedComments: "Saved comments are invalid.",

    justNow: "Just now",
    minutesAgo: "{value}m ago",
    hoursAgo: "{value}h ago",
    daysAgo: "{value}d ago",
  },

  es: {
    brand: "LEGATHON WALK",
    communityComments: "COMENTARIOS DE LA COMUNIDAD",
    back: "‹ Atrás",
    journey: "RECORRIDO",

    writeComment: "Escribe un comentario...",
    post: "Publicar",
    posting: "Publicando...",

    comments: "Comentarios",
    loadingComments: "Cargando comentarios...",
    noComments:
      "Aún no hay comentarios. Sé el primero.",

    delete: "Eliminar",
    deleteCommentTitle: "¿Eliminar comentario?",
    deleteCommentMessage:
      "Este comentario será eliminado.",
    cancel: "Cancelar",

    emptyCommentTitle: "Comentario vacío",
    emptyCommentMessage:
      "Escribe un comentario primero.",

    unableToPost: "No se pudo publicar",
    unableToPostMessage:
      "Tu comentario no pudo guardarse. Inténtalo de nuevo.",

    unableToDelete: "No se pudo eliminar",
    tryAgain: "Inténtalo de nuevo.",

    legathonWalker: "Caminante Legathon",
    you: "Tú",

    invalidSavedComments:
      "Los comentarios guardados no son válidos.",

    justNow: "Ahora mismo",
    minutesAgo: "Hace {value} min",
    hoursAgo: "Hace {value} h",
    daysAgo: "Hace {value} d",
  },

  fr: {
    brand: "LEGATHON WALK",
    communityComments: "COMMENTAIRES DE LA COMMUNAUTÉ",
    back: "‹ Retour",
    journey: "PARCOURS",

    writeComment: "Écrivez un commentaire...",
    post: "Publier",
    posting: "Publication...",

    comments: "Commentaires",
    loadingComments: "Chargement des commentaires...",
    noComments:
      "Aucun commentaire pour le moment. Soyez le premier.",

    delete: "Supprimer",
    deleteCommentTitle: "Supprimer le commentaire ?",
    deleteCommentMessage:
      "Ce commentaire sera supprimé.",
    cancel: "Annuler",

    emptyCommentTitle: "Commentaire vide",
    emptyCommentMessage:
      "Écrivez d'abord un commentaire.",

    unableToPost: "Publication impossible",
    unableToPostMessage:
      "Votre commentaire n'a pas pu être enregistré. Réessayez.",

    unableToDelete: "Suppression impossible",
    tryAgain: "Veuillez réessayer.",

    legathonWalker: "Marcheur Legathon",
    you: "Vous",

    invalidSavedComments:
      "Les commentaires enregistrés ne sont pas valides.",

    justNow: "À l'instant",
    minutesAgo: "Il y a {value} min",
    hoursAgo: "Il y a {value} h",
    daysAgo: "Il y a {value} j",
  },

  de: {
    brand: "LEGATHON WALK",
    communityComments: "COMMUNITY-KOMMENTARE",
    back: "‹ Zurück",
    journey: "JOURNEY",

    writeComment: "Kommentar schreiben...",
    post: "Posten",
    posting: "Wird gepostet...",

    comments: "Kommentare",
    loadingComments: "Kommentare werden geladen...",
    noComments:
      "Noch keine Kommentare. Sei der Erste.",

    delete: "Löschen",
    deleteCommentTitle: "Kommentar löschen?",
    deleteCommentMessage:
      "Dieser Kommentar wird entfernt.",
    cancel: "Abbrechen",

    emptyCommentTitle: "Leerer Kommentar",
    emptyCommentMessage:
      "Schreibe zuerst einen Kommentar.",

    unableToPost: "Posten nicht möglich",
    unableToPostMessage:
      "Dein Kommentar konnte nicht gespeichert werden. Bitte versuche es erneut.",

    unableToDelete: "Löschen nicht möglich",
    tryAgain: "Bitte versuche es erneut.",

    legathonWalker: "Legathon Walker",
    you: "Du",

    invalidSavedComments:
      "Gespeicherte Kommentare sind ungültig.",

    justNow: "Gerade eben",
    minutesAgo: "Vor {value} Min.",
    hoursAgo: "Vor {value} Std.",
    daysAgo: "Vor {value} T.",
  },

  pt: {
    brand: "LEGATHON WALK",
    communityComments: "COMENTÁRIOS DA COMUNIDADE",
    back: "‹ Voltar",
    journey: "JORNADA",

    writeComment: "Escreva um comentário...",
    post: "Publicar",
    posting: "Publicando...",

    comments: "Comentários",
    loadingComments: "Carregando comentários...",
    noComments:
      "Ainda não há comentários. Seja o primeiro.",

    delete: "Excluir",
    deleteCommentTitle: "Excluir comentário?",
    deleteCommentMessage:
      "Este comentário será removido.",
    cancel: "Cancelar",

    emptyCommentTitle: "Comentário vazio",
    emptyCommentMessage:
      "Escreva um comentário primeiro.",

    unableToPost: "Não foi possível publicar",
    unableToPostMessage:
      "Seu comentário não pôde ser salvo. Tente novamente.",

    unableToDelete: "Não foi possível excluir",
    tryAgain: "Tente novamente.",

    legathonWalker: "Caminhante Legathon",
    you: "Você",

    invalidSavedComments:
      "Os comentários salvos são inválidos.",

    justNow: "Agora mesmo",
    minutesAgo: "Há {value} min",
    hoursAgo: "Há {value} h",
    daysAgo: "Há {value} d",
  },

  ja: {
    brand: "LEGATHON WALK",
    communityComments: "コミュニティコメント",
    back: "‹ 戻る",
    journey: "ジャーニー",

    writeComment: "コメントを書く...",
    post: "投稿",
    posting: "投稿中...",

    comments: "コメント",
    loadingComments: "コメントを読み込み中...",
    noComments:
      "まだコメントはありません。最初のコメントを投稿しましょう。",

    delete: "削除",
    deleteCommentTitle: "コメントを削除しますか？",
    deleteCommentMessage:
      "このコメントは削除されます。",
    cancel: "キャンセル",

    emptyCommentTitle: "コメントが空です",
    emptyCommentMessage:
      "コメントを入力してください。",

    unableToPost: "投稿できません",
    unableToPostMessage:
      "コメントを保存できませんでした。もう一度お試しください。",

    unableToDelete: "削除できません",
    tryAgain: "もう一度お試しください。",

    legathonWalker: "Legathon ウォーカー",
    you: "あなた",

    invalidSavedComments:
      "保存されたコメントが無効です。",

    justNow: "たった今",
    minutesAgo: "{value}分前",
    hoursAgo: "{value}時間前",
    daysAgo: "{value}日前",
  },

  ko: {
    brand: "LEGATHON WALK",
    communityComments: "커뮤니티 댓글",
    back: "‹ 뒤로",
    journey: "여정",

    writeComment: "댓글을 작성하세요...",
    post: "게시",
    posting: "게시 중...",

    comments: "댓글",
    loadingComments: "댓글 불러오는 중...",
    noComments:
      "아직 댓글이 없습니다. 첫 댓글을 남겨보세요.",

    delete: "삭제",
    deleteCommentTitle: "댓글을 삭제할까요?",
    deleteCommentMessage:
      "이 댓글이 삭제됩니다.",
    cancel: "취소",

    emptyCommentTitle: "빈 댓글",
    emptyCommentMessage:
      "먼저 댓글을 작성하세요.",

    unableToPost: "게시할 수 없습니다",
    unableToPostMessage:
      "댓글을 저장할 수 없습니다. 다시 시도하세요.",

    unableToDelete: "삭제할 수 없습니다",
    tryAgain: "다시 시도하세요.",

    legathonWalker: "Legathon 워커",
    you: "나",

    invalidSavedComments:
      "저장된 댓글이 올바르지 않습니다.",

    justNow: "방금",
    minutesAgo: "{value}분 전",
    hoursAgo: "{value}시간 전",
    daysAgo: "{value}일 전",
  },

  zh: {
    brand: "LEGATHON WALK",
    communityComments: "社区评论",
    back: "‹ 返回",
    journey: "旅程",

    writeComment: "写下评论...",
    post: "发布",
    posting: "正在发布...",

    comments: "评论",
    loadingComments: "正在加载评论...",
    noComments:
      "还没有评论。来发表第一条评论吧。",

    delete: "删除",
    deleteCommentTitle: "删除评论？",
    deleteCommentMessage:
      "这条评论将被删除。",
    cancel: "取消",

    emptyCommentTitle: "评论为空",
    emptyCommentMessage:
      "请先写一条评论。",

    unableToPost: "无法发布",
    unableToPostMessage:
      "无法保存你的评论。请重试。",

    unableToDelete: "无法删除",
    tryAgain: "请重试。",

    legathonWalker: "Legathon 步行者",
    you: "你",

    invalidSavedComments:
      "保存的评论无效。",

    justNow: "刚刚",
    minutesAgo: "{value}分钟前",
    hoursAgo: "{value}小时前",
    daysAgo: "{value}天前",
  },

  it: {
    brand: "LEGATHON WALK",
    communityComments: "COMMENTI DELLA COMMUNITY",
    back: "‹ Indietro",
    journey: "PERCORSO",

    writeComment: "Scrivi un commento...",
    post: "Pubblica",
    posting: "Pubblicazione...",

    comments: "Commenti",
    loadingComments: "Caricamento commenti...",
    noComments:
      "Nessun commento. Sii il primo.",

    delete: "Elimina",
    deleteCommentTitle: "Eliminare il commento?",
    deleteCommentMessage:
      "Questo commento verrà rimosso.",
    cancel: "Annulla",

    emptyCommentTitle: "Commento vuoto",
    emptyCommentMessage:
      "Scrivi prima un commento.",

    unableToPost: "Impossibile pubblicare",
    unableToPostMessage:
      "Il tuo commento non è stato salvato. Riprova.",

    unableToDelete: "Impossibile eliminare",
    tryAgain: "Riprova.",

    legathonWalker: "Camminatore Legathon",
    you: "Tu",

    invalidSavedComments:
      "I commenti salvati non sono validi.",

    justNow: "Proprio ora",
    minutesAgo: "{value} min fa",
    hoursAgo: "{value} h fa",
    daysAgo: "{value} g fa",
  },

  ar: {
    brand: "LEGATHON WALK",
    communityComments: "تعليقات المجتمع",
    back: "رجوع ›",
    journey: "الرحلة",

    writeComment: "اكتب تعليقًا...",
    post: "نشر",
    posting: "جارٍ النشر...",

    comments: "التعليقات",
    loadingComments: "جارٍ تحميل التعليقات...",
    noComments:
      "لا توجد تعليقات بعد. كن أول من يعلق.",

    delete: "حذف",
    deleteCommentTitle: "حذف التعليق؟",
    deleteCommentMessage:
      "سيتم حذف هذا التعليق.",
    cancel: "إلغاء",

    emptyCommentTitle: "التعليق فارغ",
    emptyCommentMessage:
      "يرجى كتابة تعليق أولًا.",

    unableToPost: "تعذر النشر",
    unableToPostMessage:
      "تعذر حفظ تعليقك. يرجى المحاولة مرة أخرى.",

    unableToDelete: "تعذر الحذف",
    tryAgain: "يرجى المحاولة مرة أخرى.",

    legathonWalker: "مشارك Legathon",
    you: "أنت",

    invalidSavedComments:
      "التعليقات المحفوظة غير صالحة.",

    justNow: "الآن",
    minutesAgo: "منذ {value} د",
    hoursAgo: "منذ {value} س",
    daysAgo: "منذ {value} ي",
  },
};

// ============================================================
// HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[code] ? code : "en";
}

function fillTemplate(text, values = {}) {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.replace(
        new RegExp(`\\{${key}\\}`, "g"),
        String(value)
      ),
    String(text || "")
  );
}

const LOCALES = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  it: "it-IT",
  ar: "ar-SA",
};

// ============================================================
// COMMUNITY COMMENTS SCREEN
// ============================================================

export default function CommunityCommentsScreen({
  route,
  navigation,

  post = null,

  goBack,

  userName = "You",

  language = "en",
}) {
  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const languageCode =
    normalizeLanguage(language);

  const isRTL =
    languageCode === "ar";

  const t = useCallback(
    (key, values = {}) => {
      const value =
        TEXT[languageCode]?.[key] ??
        TEXT.en?.[key] ??
        key;

      return fillTemplate(
        value,
        values
      );
    },
    [languageCode]
  );

  // ==========================================================
  // POST DATA
  // ==========================================================

  const routeParams =
    route?.params || {};

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
          await AsyncStorage.getItem(
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
            t("invalidSavedComments")
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
      t,
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
      await AsyncStorage.setItem(
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
          t("emptyCommentTitle"),
          t("emptyCommentMessage")
        );

        return;
      }

      if (posting) {
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
          t("you"),

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
          t("unableToPost"),
          t("unableToPostMessage")
        );
      } finally {
        setPosting(false);
      }
    };

  // ==========================================================
  // DELETE COMMENT
  // ==========================================================

  const deleteComment =
    (id) => {
      Alert.alert(
        t("deleteCommentTitle"),
        t("deleteCommentMessage"),
        [
          {
            text:
              t("cancel"),

            style:
              "cancel",
          },

          {
            text:
              t("delete"),

            style:
              "destructive",

            onPress:
              async () => {
                try {
                  const updatedComments =
                    comments.filter(
                      (item) =>
                        item.id !== id
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
                    t("unableToDelete"),
                    t("tryAgain")
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
    (createdAt) => {
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
        Math.max(
          0,
          Date.now() -
            created.getTime()
        );

      const minutes =
        Math.floor(
          difference /
            60000
        );

      if (
        minutes < 1
      ) {
        return t(
          "justNow"
        );
      }

      if (
        minutes < 60
      ) {
        return t(
          "minutesAgo",
          {
            value:
              minutes,
          }
        );
      }

      const hours =
        Math.floor(
          minutes /
            60
        );

      if (
        hours < 24
      ) {
        return t(
          "hoursAgo",
          {
            value:
              hours,
          }
        );
      }

      const days =
        Math.floor(
          hours /
            24
        );

      if (
        days < 7
      ) {
        return t(
          "daysAgo",
          {
            value:
              days,
          }
        );
      }

      return created
        .toLocaleDateString(
          LOCALES[
            languageCode
          ] || "en-US"
        );
    };

  // ==========================================================
  // RENDER COMMENT
  // ==========================================================

  const renderComment =
    ({ item }) => {
      return (
        <View
          style={
            styles.commentCard
          }
        >
          <View
            style={[
              styles.commentTop,
              isRTL &&
                styles.rtlRow,
            ]}
          >
            <View
              style={
                styles.commentUserInfo
              }
            >
              <Text
                style={[
                  styles.commentName,
                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {item.name ||
                  t(
                    "legathonWalker"
                  )}
              </Text>

              <Text
                style={[
                  styles.time,
                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {getCommentTime(
                  item.createdAt
                )}
              </Text>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={
                t("delete")
              }
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
                {t(
                  "delete"
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.commentText,
              isRTL &&
                styles.rtlText,
            ]}
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
        {/* BACK */}

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            t("back")
          }
          onPress={
            handleBack
          }
          style={[
            styles.backButton,
            isRTL &&
              styles.backButtonRTL,
          ]}
        >
          <Text
            style={[
              styles.back,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {t("back")}
          </Text>
        </TouchableOpacity>

        {/* BRAND */}

        <Text
          style={[
            styles.brand,
            isRTL &&
              styles.rtlText,
          ]}
        >
          {t("brand")}
        </Text>

        {/* SECTION */}

        <Text
          style={[
            styles.small,
            isRTL &&
              styles.rtlText,
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {t(
            "communityComments"
          )}
        </Text>

        {/* POST NAME */}

        <Text
          style={[
            styles.title,
            isRTL &&
              styles.rtlText,
          ]}
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {postName}
        </Text>

        {/* ORIGINAL POST */}

        <View
          style={
            styles.postBox
          }
        >
          {!!postText && (
            <Text
              style={[
                styles.postText,
                isRTL &&
                  styles.rtlText,
              ]}
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
                style={[
                  styles.journeyLabel,
                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {t(
                  "journey"
                )}
              </Text>

              <Text
                style={[
                  styles.journeyText,
                  isRTL &&
                    styles.rtlText,
                ]}
              >
                {postJourney}
              </Text>
            </View>
          )}
        </View>

        {/* COMMENT INPUT */}

        <View
          style={
            styles.inputBox
          }
        >
          <TextInput
            style={[
              styles.input,
              isRTL &&
                styles.rtlInput,
            ]}
            placeholder={
              t(
                "writeComment"
              )
            }
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
            editable={
              !posting
            }
          />

          <View
            style={[
              styles.inputFooter,
              isRTL &&
                styles.rtlRow,
            ]}
          >
            <Text
              style={
                styles.characterCount
              }
            >
              {comment.length}/500
            </Text>

            <TouchableOpacity
              accessibilityRole="button"
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
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {posting
                  ? t(
                      "posting"
                    )
                  : t(
                      "post"
                    )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* COMMENTS HEADER */}

        <View
          style={[
            styles.commentHeader,
            isRTL &&
              styles.rtlRow,
          ]}
        >
          <Text
            style={[
              styles.commentHeaderTitle,
              isRTL &&
                styles.rtlText,
            ]}
          >
            {t(
              "comments"
            )}
          </Text>

          <Text
            style={[
              styles.commentCount,
              isRTL
                ? styles.commentCountRTL
                : null,
            ]}
          >
            {comments.length}
          </Text>
        </View>

        {/* COMMENTS LIST */}

        <FlatList
          data={
            comments
          }
          keyExtractor={
            (item) =>
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
              style={[
                styles.empty,
                isRTL &&
                  styles.rtlText,
              ]}
            >
              {loading
                ? t(
                    "loadingComments"
                  )
                : t(
                    "noComments"
                  )}
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

    backButtonRTL: {
      alignSelf:
        "flex-end",
      paddingRight: 0,
      paddingLeft: 20,
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
      minWidth:
        90,
      alignItems:
        "center",
      justifyContent:
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
      textAlign:
        "center",
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

    commentCountRTL: {
      marginLeft: 0,
      marginRight: 9,
    },

    listContent: {
      paddingBottom:
        120,
      flexGrow: 1,
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

    commentUserInfo: {
      flex: 1,
      minWidth: 0,
      paddingRight: 12,
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

    rtlText: {
      writingDirection:
        "rtl",
      textAlign:
        "right",
    },

    rtlInput: {
      writingDirection:
        "rtl",
      textAlign:
        "right",
    },

    rtlRow: {
      flexDirection:
        "row-reverse",
    },
  });