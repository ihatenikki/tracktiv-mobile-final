// screens.js
import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { ActivityCard, PostCard, Header } from "./components";
import { activities as activitiesDataImport } from "./data";
import { getRecordsOfMonth } from "./storage";

const { width, height } = Dimensions.get("window");

/* -------------------------
   ONBOARDING (parallax + blur)
   ------------------------- */

export function Onboarding({ theme, onFinish }) {
  const slides = [
    {
      key: "intro",
      title: "Monitore seu estilo de vida!",
      subtitle: "Com uma abordagem orientada para alcançar o objetivo",
      bg:
        "https://images.wallpaperscraft.com/image/single/code_text_colorful_140555_1080x1920.jpg",
    },
    {
      key: "create",
      title: "Crie uma conta nova",
      subtitle: "Para uma melhor experiência com o Tracktiv",
      bg:
        "https://img.freepik.com/fotos-premium/felizes-amigos-brincalhoes-no-parque-contra-o-ceu-limpo_1048944-1466369.jpg?semt=ais_se_enriched&w=740&q=80",
    },
    {
      key: "activities",
      title: "Adicione suas atividades favoritas",
      subtitle: "Para seu perfil personalizado",
      bg:
        "https://cdn.prod.website-files.com/67bd7c23d7f9559b8e601ff1/67bd7c23d7f9559b8e60227d_family-activities-st-barts%20(7)-min.png",
    },
    {
      key: "easy",
      title: "Facilmente monitore suas atividades",
      subtitle: "Entre e registre de forma simples",
      bg:
        "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1200&q=60",
    },
    {
      key: "progress",
      title: "Veja seu progresso mensal",
      subtitle: "Um calendário interativo de monitoramento",
      bg:
        "https://images.wallpaperscraft.com/image/single/calendar_inscription_motivation_139751_1080x1920.jpg",
    },
  ];

  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const onMomentum = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const goNext = () => {
    if (!scrollRef.current) return;
    if (index < slides.length - 1) {
      const next = index + 1;
      scrollRef.current.scrollTo({ x: width * next, animated: true });
      setIndex(next);
    } else {
      onFinish && onFinish();
    }
  };

  // animação de fade entre telas 
  useEffect(() => {
    fade.setValue(0.9);
    Animated.timing(fade, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={onMomentum}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {slides.map((s, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width * 0.2, 0, width * 0.2],
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
          });

          return (
            <View
              key={s.key}
              style={{ width, height, flex: 1, overflow: "hidden" }}
            >
              <Animated.Image
                source={{ uri: s.bg }}
                style={{
                  position: "absolute",
                  width: width + 80,
                  height: height,
                  left: -40,
                  transform: [{ translateX }],
                  opacity,
                  resizeMode: "cover",
                }}
              />

              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(10,10,10,0.25)",
                }}
              />

              <BlurView
                intensity={20}
                tint="dark"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />

              <Animated.View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  paddingHorizontal: 28,
                  paddingBottom: 48,
                  opacity: fade,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 34,
                    fontWeight: "900",
                    lineHeight: 42,
                    marginBottom: 8,
                  }}
                >
                  {s.title}
                </Text>

                <Text
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 22,
                  }}
                >
                  {s.subtitle}
                </Text>

                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={goNext}
                    activeOpacity={0.9}
                    style={{
                      backgroundColor: "#fff",
                      paddingVertical: 12,
                      paddingHorizontal: 36,
                      borderRadius: 28,
                      elevation: 5,
                      shadowColor: "#000",
                      shadowOpacity: 0.18,
                      shadowOffset: { width: 0, height: 6 },
                      shadowRadius: 8,
                    }}
                  >
                    <Text
                      style={{ color: "#0b1220", fontWeight: "900" }}
                    >
                      {i < slides.length - 1 ? "PRÓXIMO" : "COMEÇAR"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: "center", marginTop: 18 }}>
                  <View style={{ flexDirection: "row" }}>
                    {slides.map((_, dd) => (
                      <View
                        key={dd}
                        style={{
                          width: dd === index ? 16 : 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor:
                            dd === index
                              ? "#fff"
                              : "rgba(255,255,255,0.35)",
                          marginHorizontal: 6,
                        }}
                      />
                    ))}
                  </View>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

//FEED
export function Discover({ theme, activities, onSelectActivity }) {
  const acts = Array.isArray(activities)
    ? activities
    : activitiesDataImport || [];
  return (
    <ScrollView
      style={{ padding: 16 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View
        style={{
          padding: 18,
          borderRadius: 12,
          marginBottom: 12,
          backgroundColor: "#98D1C1",
        }}
      >
        <Text
          style={{ fontSize: 22, fontWeight: "900", color: "#fff" }}
        >
          Descobrir Atividades
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.95)",
            marginTop: 8,
          }}
        >
          Tenha diversão e novas experiências
        </Text>
      </View>

      <Text
        style={{ fontWeight: "800", marginTop: 12, color: theme.text }}
      >
        Em alta
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      >
        {acts.map((a) => (
          <ActivityCard
            key={a.id}
            item={a}
            onPress={(it) => onSelectActivity(it)}
          />
        ))}
      </ScrollView>

      <Text
        style={{ fontWeight: "800", marginTop: 8, color: theme.text }}
      >
        Todas
      </Text>
      <FlatList
        data={acts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginTop: 12 }}
            onPress={() => onSelectActivity(item)}
          >
            <View
              style={{
                height: 96,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: theme.cardBg,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  left: 12,
                  bottom: 12,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "800" }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#fff" }}>{item.tag}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </ScrollView>
  );
}

// Feed com header
export function Feed({ theme, posts, onLike, onOpenComments }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* header topo */}
      <View
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.cardBg,
          borderBottomWidth: 0.5,
          borderBottomColor: "rgba(0,0,0,0.06)",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: theme.text,
            }}
          >
            Tracktiv
          </Text>
          <Text style={{ color: theme.muted, fontSize: 12 }}>
            Hoje cedo • Amigos
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.12)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.muted }}>i</Text>
          </View>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 12, color: theme.muted }}>🔔</Text>
          </View>
        </View>
      </View>

      {/* lista de posts */}
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={onLike}
            onComment={onOpenComments}
            theme={theme}
          />
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 120,
        }}
      />
    </View>
  );
}

/* -------------------------
   RECORD (timer e salvar)
   ------------------------- */

export function Record({
  theme,
  selectedActivity,
  activities,
  onToggle,
  recording,
  seconds,
  onReset,
  onSelectActivity,
  onSave,
}) {
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");

  const savedOpacity = useRef(new Animated.Value(0)).current;
  const showSavedBadge = () => {
    savedOpacity.setValue(0);
    Animated.timing(savedOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(savedOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1200);
    });
  };

  const handleSave = async () => {
    if (saving) return;
    const activityId = selectedActivity?.id || "fallback";
    setSaving(true);
    try {
      await onSave(activityId, seconds);
      setSavedAt(new Date().toISOString());
      showSavedBadge();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar o registro.");
      console.warn("handleSave error", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{
          uri:
            selectedActivity?.image ||
            "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1200&q=60",
        }}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      >
        <Text style={{ color: theme.muted, marginBottom: 12 }}>
          ATIVIDADE ATUAL
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: "800",
          }}
        >
          {selectedActivity?.title || "Atividade"}
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 48,
            fontWeight: "800",
            marginTop: 8,
          }}
        >
          {minutes}:{sec}
        </Text>

        <TouchableOpacity
          onPress={onToggle}
          style={{
            marginTop: 12,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 30,
          }}
        >
          <Text style={{ fontWeight: "800", color: "#0b1220" }}>
            {recording ? "PARAR" : "INICIAR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onReset} style={{ marginTop: 8 }}>
          <Text style={{ color: theme.muted }}>RESET</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 18, width: "100%" }}>
          <Text style={{ color: theme.muted, marginBottom: 8 }}>
            Escolher atividade
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            {(activities || activitiesDataImport).map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => onSelectActivity(a)}
                style={{
                  width: 100,
                  height: 56,
                  borderRadius: 10,
                  overflow: "hidden",
                  marginRight: 8,
                }}
              >
                <Image
                  source={{ uri: a.image }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            marginTop: 18,
            backgroundColor: "#E07A5F",
            padding: 10,
            borderRadius: 8,
            opacity: saving ? 0.8 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            {saving ? "Salvando..." : "Salvar registro"}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={{
            position: "absolute",
            bottom: 140,
            alignSelf: "center",
            paddingVertical: 8,
            paddingHorizontal: 14,
            backgroundColor: "#F1A28C",
            borderRadius: 16,
            opacity: savedOpacity,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Salvo ✔
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

/* -------------------------
   CALENDÁRIO
   ------------------------- */

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function firstWeekdayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min ${s} s`;
}

export function ActivityCalendar({ theme }) {
  const today = useMemo(() => new Date(), []);
  const [yearMonth, setYearMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const r = await getRecordsOfMonth(yearMonth.year, yearMonth.month);
        if (!mounted) return;
        setRecords(r || {});
      } catch (e) {
        console.warn("ActivityCalendar: erro ao carregar registros", e);
        setRecords({});
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [yearMonth]);

  const totalDays = daysInMonth(yearMonth.year, yearMonth.month);
  const firstWeekday = firstWeekdayOfMonth(
    yearMonth.year,
    yearMonth.month
  );

  const grid = [];
  let week = [];
  for (let i = 0; i < firstWeekday; i++) week.push(null);
  for (let day = 1; day <= totalDays; day++) {
    week.push(day);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }

  const goPrevMonth = () => {
    setYearMonth(({ year, month }) => {
      if (month === 1) return { year: year - 1, month: 12 };
      return { year, month: month - 1 };
    });
  };
  const goNextMonth = () => {
    setYearMonth(({ year, month }) => {
      if (month === 12) return { year: year + 1, month: 1 };
      return { year, month: month + 1 };
    });
  };

  const openDay = (dayNum) => {
    setSelectedDay(dayNum);
    setModalVisible(true);
  };

  const selectedRecords = selectedDay
    ? records[String(selectedDay)] || []
    : [];
  const isToday = (d) => {
    return (
      d === today.getDate() &&
      yearMonth.month === today.getMonth() + 1 &&
      yearMonth.year === today.getFullYear()
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: "800", color: theme.text }}
        >
          Calendário
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={goPrevMonth}
            style={{ padding: 8, marginRight: 6 }}
          >
            <Text style={{ color: theme.muted }}>◀</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: "700",
              color: theme.text,
            }}
          >
            {`${yearMonth.month.toString().padStart(2, "0")}/${
              yearMonth.year
            }`}
          </Text>
          <TouchableOpacity
            onPress={goNextMonth}
            style={{ padding: 8, marginLeft: 6 }}
          >
            <Text style={{ color: theme.muted }}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <Text style={{ color: theme.muted }}>Carregando...</Text>
      ) : (
        <>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
              (w, i) => (
                <View
                  key={i}
                  style={{
                    width: (width - 32) / 7,
                    alignItems: "center",
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    style={{
                      color: theme.muted,
                      fontWeight: "700",
                      fontSize: 12,
                    }}
                  >
                    {w}
                  </Text>
                </View>
              )
            )}
          </View>

          <View>
            {grid.map((weekRow, rIdx) => (
              <View
                key={rIdx}
                style={{ flexDirection: "row", marginBottom: 6 }}
              >
                {weekRow.map((d, cIdx) => {
                  if (d === null) {
                    return (
                      <View
                        key={cIdx}
                        style={{
                          width: (width - 32) / 7,
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      />
                    );
                  }
                  const dayHas =
                    Array.isArray(records[String(d)]) &&
                    records[String(d)].length > 0;
                  const selected = isToday(d);
                  return (
                    <TouchableOpacity
                      key={cIdx}
                      onPress={() => openDay(d)}
                      activeOpacity={0.8}
                      style={{
                        width: (width - 32) / 7,
                        alignItems: "center",
                        paddingVertical: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 19,
                          backgroundColor: selected
                            ? theme.action
                            : dayHas
                            ? theme.cardBg
                            : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: selected ? "#fff" : theme.text,
                            fontWeight: selected ? "800" : "600",
                          }}
                        >
                          {d}
                        </Text>
                      </View>
                      <View style={{ height: 8 }} />
                      {dayHas ? (
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.action,
                            marginTop: 6,
                          }}
                        />
                      ) : (
                        <View style={{ height: 6, marginTop: 6 }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={{ height: 16 }} />

          <Text
            style={{ color: theme.muted, marginBottom: 8 }}
          >
            Clique num dia para ver os registros
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.action,
                marginRight: 8,
              }}
            />
            <Text style={{ color: theme.muted }}>Registro salvo</Text>
            <View style={{ width: 16 }} />
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: theme.cardBg,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.06)",
                marginRight: 8,
              }}
            />
            <Text style={{ color: theme.muted }}>Hoje</Text>
          </View>
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View
            style={[
              modalStyles.sheet,
              { backgroundColor: theme.cardBg },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text
                style={{ fontWeight: "800", color: theme.text }}
              >
                Dia {selectedDay}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ padding: 6 }}
              >
                <Text style={{ color: theme.muted }}>Fechar</Text>
              </TouchableOpacity>
            </View>

            {!selectedRecords || selectedRecords.length === 0 ? (
              <Text style={{ color: theme.muted }}>
                Nenhum registro neste dia.
              </Text>
            ) : (
              <FlatList
                data={selectedRecords}
                keyExtractor={(it, idx) =>
                  `${it.activityId}-${idx}-${it.timestamp}`
                }
                renderItem={({ item }) => (
                  <View
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "rgba(0,0,0,0.04)",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        color: theme.text,
                      }}
                    >
                      Atividade: {item.activityId}
                    </Text>
                    <Text
                      style={{
                        color: theme.muted,
                        marginTop: 4,
                      }}
                    >
                      Tempo: {formatTime(item.seconds || 0)}
                    </Text>
                    <Text
                      style={{
                        color: theme.muted,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      Registrado em:{" "}
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "70%",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

/* -------------------------
   PERFIL / COMENTARIOS / CONFIGS
   ------------------------- */

export function Profile({ theme, user, posts, onOpenSettings }) {
  return (
    <ScrollView
      style={{ padding: 16 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={{ alignItems: "center", padding: 20 }}>
        <Image
          source={user?.avatar || null}
          style={{
            width: 96,
            height: 96,
            borderRadius: 18,
            backgroundColor: "#ddd",
          }}
        />
        <Text
          style={{
            fontWeight: "900",
            fontSize: 18,
            marginTop: 12,
            color: theme.text,
          }}
        >
          {user?.name || "Usuário"}
        </Text>
        <Text style={{ color: theme.muted, marginTop: 6 }}>
          Apaixonado por tecnologia e atividades
        </Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text
          style={{ fontWeight: "800", color: theme.text }}
        >
          Atividades recentes
        </Text>
        {posts.map((f) => (
          <View
            key={f.id}
            style={{
              borderRadius: 12,
              padding: 12,
              backgroundColor: theme.cardBg,
              marginTop: 10,
            }}
          >
            <Text
              style={{ fontWeight: "700", color: theme.text }}
            >
              {f.user.name}
            </Text>
            <Text style={{ color: theme.muted }}>{f.title}</Text>
          </View>
        ))}
        <TouchableOpacity
          onPress={onOpenSettings}
          style={{
            marginTop: 16,
            backgroundColor: "#E07A5F",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            Configurações
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export function Comments({ theme, post, onAddComment, onBack }) {
  const [text, setText] = useState("");
  return (
    <View style={{ flex: 1 }}>
      <Header title="Comentários" theme={theme} onLeftPress={onBack} />
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontWeight: "800",
            marginBottom: 8,
            color: theme.text,
          }}
        >
          {post?.user?.name}
        </Text>
        {post?.comments?.map((c) => (
          <View key={c.id} style={{ paddingVertical: 8 }}>
            <Text style={{ color: theme.text }}>{c.text}</Text>
          </View>
        ))}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escreva um comentário"
          placeholderTextColor={theme.muted}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 8,
            borderRadius: 8,
            marginTop: 12,
            color: theme.text,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            onAddComment(post.id, text);
            setText("");
          }}
          style={{
            marginTop: 8,
            backgroundColor: "#E07A5F",
            padding: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            Comentar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function Settings({ theme, darkMode, setDarkMode, onBack }) {
  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Configurações"
        theme={theme}
        onLeftPress={onBack}
      />
      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: theme.text, fontWeight: "700" }}
          >
            Modo noturno
          </Text>
          <TouchableOpacity
            onPress={() => setDarkMode(!darkMode)}
            style={{
              padding: 8,
              backgroundColor: darkMode ? "#333" : "#eee",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: darkMode ? "#fff" : "#333" }}>
              {darkMode ? "ON" : "OFF"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
