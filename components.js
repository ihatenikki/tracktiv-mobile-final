import React, { useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet
} from "react-native";

/* efeito de "bounce */
export function AnimatedPressable({ onPress, style, children }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      friction: 7,
      tension: 100,
      useNativeDriver: true
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: true
    }).start();

  const animatedStyle = style
    ? [{ transform: [{ scale }] }, style]
    : { transform: [{ scale }] };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

/* card de atividade */
export function ActivityCard({ item, onPress }) {
  return (
    <AnimatedPressable onPress={() => onPress(item)} style={styles.activityCard}>
      <Image source={{ uri: item.image }} style={styles.activityImage} />
      <View style={styles.activityCardOverlay} />
      <View style={styles.activityCardContent}>
        <Text numberOfLines={1} style={styles.activityTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.activityTag}>
          {item.tag}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

/* card do feed */
export function PostCard({ post, onLike, onComment, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <View style={styles.cardRow}>
        {post.user?.avatar ? (
          <Image source={post.user.avatar} style={styles.cardAvatar} />
        ) : (
          <View style={[styles.cardAvatar, { backgroundColor: "#ddd" }]} />
        )}
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.cardUser, { color: theme.text }]}>
            {post.user?.name || "Usuário"}
          </Text>
          <Text style={[styles.cardTitle, { color: theme.muted }]}>
            {post.title}
          </Text>
          <Text style={[styles.cardTime, { color: theme.muted }]}>
            {post.time}
          </Text>
        </View>
      </View>

      <View style={styles.cardActionsRow}>
        <TouchableOpacity
          onPress={() => onLike(post.id)}
          style={{ padding: 6 }}
        >
          <Text style={{ color: post.liked ? theme.action : theme.muted }}>
            {post.liked ? `♥ ${post.likes}` : `♡ ${post.likes}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onComment(post)}
          style={{ padding: 6 }}
        >
          <Text style={{ color: theme.muted }}>
            💬 {Array.isArray(post.comments) ? post.comments.length : 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* cabecalho */
export function Header({ title, rightImage, onRightPress, theme, onLeftPress }) {
  return (
    <View style={[styles.header, { backgroundColor: theme.header }]}>
      <TouchableOpacity onPress={onLeftPress} style={{ padding: 6 }}>
        <Text style={{ color: theme.action, fontWeight: "700" }}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={[styles.logo, { color: theme.text }]}>{title}</Text>
      <TouchableOpacity onPress={onRightPress} style={{ padding: 6 }}>
        {rightImage ? (
          <Image
            source={rightImage}
            style={{ width: 36, height: 36, borderRadius: 10 }}
          />
        ) : (
          <View style={{ width: 36 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

/* barra inferior */
export function BottomBar({ active, onPressItem, theme, onFab }) {
  return (
    <View style={[styles.bottomBar, { backgroundColor: theme.bottom }]}>
      <TouchableOpacity onPress={() => onPressItem("feed")} style={styles.navItem}>
        <Text
          style={[
            styles.navLabel,
            active === "feed" && styles.navLabelActive,
            { color: active === "feed" ? theme.action : theme.muted }
          ]}
        >
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressItem("discover")} style={styles.navItem}>
        <Text
          style={[
            styles.navLabel,
            active === "discover" && styles.navLabelActive,
            { color: active === "discover" ? theme.action : theme.muted }
          ]}
        >
          Descobrir
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onFab} style={styles.fab}>
        <View style={[styles.fabGradient, { backgroundColor: theme.action }]}>
          <Text style={styles.fabText}>+</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressItem("activity")} style={styles.navItem}>
        <Text
          style={[
            styles.navLabel,
            active === "activity" && styles.navLabelActive,
            { color: active === "activity" ? theme.action : theme.muted }
          ]}
        >
          Atividade
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressItem("profile")} style={styles.navItem}>
        <Text
          style={[
            styles.navLabel,
            active === "profile" && styles.navLabelActive,
            { color: active === "profile" ? theme.action : theme.muted }
          ]}
        >
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)"
  },
  logo: {
    fontSize: 20,
    fontWeight: "800"
  },


  activityCard: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    elevation: 3
  },
  activityImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  activityCardOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.22)"
  },
  activityCardContent: {
    position: "absolute",
    bottom: 12,
    left: 12
  },

  activityTitle: { color: "#fff", fontWeight: "800" },
  activityTag: { color: "#fff", marginTop: 4, fontSize: 12 },

  card: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  cardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#ddd"
  },
  cardUser: { fontWeight: "700" },
  cardTitle: { color: "#666" },
  cardTime: { color: "#999", marginTop: 6 },

  cardActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },

  /* bottom bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.08)"
  },

  navItem: { paddingVertical: 6, paddingHorizontal: 12 },
  navLabel: { fontWeight: "700" },
  navLabelActive: { color: "#E07A5F" },

  /* FAB corrigido */
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "visible",
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center"
  },

  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: -2
  }
});
