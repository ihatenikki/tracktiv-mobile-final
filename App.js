import React, { useEffect, useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { lightTheme, darkTheme } from "./theme";
import {
  Onboarding,
  Discover,
  Feed,
  Record,
  ActivityCalendar,
  Profile,
  Comments,
  Settings,
} from "./screens";
import {
  users as usersDataImport,
  activities as activitiesDataImport,
  posts as postsDataImport,
} from "./data";
import { saveActivityRecord } from "./storage";
import { BottomBar } from "./components";

/* auxiliares */
const safeArray = (a) => (Array.isArray(a) ? a : []);
const usersData = safeArray(usersDataImport);
const activitiesData = safeArray(activitiesDataImport);
const postsRaw = safeArray(postsDataImport);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  const fallbackActivity =
    activitiesData.length > 0
      ? activitiesData[0]
      : {
          id: "fallback",
          title: "Atividade",
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
        };

  // usuário pelo id
  const resolveUser = (userId) => {
    const found = usersData.find(
      (u) => u && (u.id === userId || String(u.id) === String(userId))
    );
    return found || usersData[0] || { id: "u0", name: "Usuário", avatar: null };
  };

  // array de posts com objetos de user
  const buildPosts = () => {
    const source = postsRaw.length
      ? postsRaw
      : [
          {
            id: "p1",
            userId: "u5",
            text: "Programou por 2 horas em Uninassau",
            likes: 4,
            comments: [{ id: "c1", text: "Parabéns!" }],
            time: "Hoje às 17:54",
          },
          {
            id: "p2",
            userId: "u6",
            text: "Jogou online por 20 minutos",
            likes: 2,
            comments: [],
            time: "Ontem às 8:42",
          },
        ];

    return source.map((p) => {
      const u = p.user || resolveUser(p.userId);
      return {
        id:
          p.id || `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        user: {
          id: u.id || "u0",
          name: u.name || "Usuário",
          avatar: u.avatar || null,
        },
        title: p.title || p.text || "",
        place: p.place || "",
        time: p.time || "",
        likes: typeof p.likes === "number" ? p.likes : 0,
        liked: !!p.liked,
        comments: Array.isArray(p.comments) ? p.comments : [],
      };
    });
  };

  const [screen, setScreen] = useState("onboard");
  const [selectedActivity, setSelectedActivity] = useState(fallbackActivity);
  const [posts, setPosts] = useState(buildPosts());
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // cronômetro
  useEffect(() => {
    let t;
    if (recording) t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  function toggleLike(postId) {
    setPosts((prev) =>
      prev.map((p) => {
        if (!p) return p;
        if (p.id === postId) {
          const likedNow = !p.liked;
          const likes =
            typeof p.likes === "number"
              ? likedNow
                ? p.likes + 1
                : Math.max(0, p.likes - 1)
              : likedNow
              ? 1
              : 0;
          return { ...p, liked: likedNow, likes };
        }
        return p;
      })
    );
  }

  function openComments(post) {
    if (!post) return;
    setSelectedPost(post);
    setScreen("comments");
  }

  function addComment(postId, text) {
    if (!text || !text.trim())
      return Alert.alert("Erro", "Comentário vazio");

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...(Array.isArray(p.comments) ? p.comments : []),
                { id: Date.now().toString(), text: text.trim() },
              ],
            }
          : p
      )
    );
  }

  async function handleSaveRecord(activityId, secondsRecorded) {
    try {
      await saveActivityRecord(activityId, secondsRecorded);
      Alert.alert("Salvo", "Registro salvo no calendário.");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  const goTo = (s) => setScreen(s);
  const finishOnboard = () => setScreen("feed");

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {screen === "onboard" && (
        <Onboarding theme={theme} onFinish={finishOnboard} />
      )}

      {screen === "feed" && (
        <Feed
          theme={theme}
          posts={posts}
          onLike={toggleLike}
          onOpenComments={(p) => {
            setSelectedPost(p);
            setScreen("comments");
          }}
        />
      )}

      {screen === "discover" && (
        <Discover
          theme={theme}
          activities={activitiesData}
          onSelectActivity={(a) => {
            setSelectedActivity(a);
            setScreen("record");
          }}
        />
      )}

      {screen === "record" && (
        <Record
          theme={theme}
          selectedActivity={selectedActivity}
          activities={activitiesData}
          onToggle={() => setRecording((r) => !r)}
          recording={recording}
          seconds={seconds}
          onReset={() => {
            setSeconds(0);
            setRecording(false);
          }}
          onSelectActivity={(a) => setSelectedActivity(a)}
          onSave={handleSaveRecord}
        />
      )}

      {screen === "activity" && <ActivityCalendar theme={theme} />}

      {screen === "profile" && (
        <Profile
          theme={theme}
          user={
            usersData[5] ||
            usersData[0] || {
              id: "u0",
              name: "Usuário",
              avatar: usersData[0]?.avatar || null,
            }
          }
          posts={posts}
          onOpenSettings={() => setScreen("settings")}
        />
      )}

      {screen === "comments" && (
        <Comments
          theme={theme}
          post={selectedPost}
          onAddComment={addComment}
          onBack={() => setScreen("feed")}
        />
      )}

      {screen === "settings" && (
        <Settings
          theme={theme}
          darkMode={darkMode}
          setDarkMode={(v) => setDarkMode(v)}
          onBack={() => setScreen("profile")}
        />
      )}

      {!["onboard", "comments", "settings"].includes(screen) && (
        <BottomBar
          active={screen}
          onPressItem={(s) => goTo(s)}
          onFab={() => setScreen("record")}
          theme={theme}
        />
      )}
    </View>
  );
}
