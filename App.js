import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Alert, Linking, SafeAreaView, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs = [
  ["today", "今日", "today-outline"],
  ["care", "照顧", "heart-outline"],
  ["visit", "覆診", "calendar-outline"],
  ["family", "家庭", "people-outline"],
  ["support", "支援", "help-buoy-outline"],
];

const starterTasks = [
  ["早餐後食血壓藥", "食藥", "08:30", "Maria", "pending", "跟藥袋指示，不提供改藥建議"],
  ["量血壓並記低數值", "量度", "10:00", "Maria", "done", "132/82，早餐前"],
  ["明天覆診前確認文件", "覆診", "20:00", "阿晴", "pending", "帶覆診紙、藥袋、最近血壓紀錄"],
  ["買低糖麥皮及紙尿片", "生活照顧", "19:30", "細佬", "skipped", "今晚不需要，明晚再買"],
].map(([title, category, time, assignee, status, note], index) => ({ id: `task-${index}`, title, category, time, assignee, status, note }));

const status = {
  pending: ["未完成", "#A85E00", "#FFF2D8"],
  done: ["完成", "#166534", "#E7F6EA"],
  skipped: ["略過", "#6B7280", "#EEF0F2"],
};

const categories = ["食藥", "覆診", "量度", "生活照顧"];
const accent = "#0F766E";

export default function App() {
  const [active, setActive] = useState("today");
  const [tasks, setTasks] = useState(starterTasks);
  const [docs, setDocs] = useState([
    { id: "doc-1", title: "5 月新藥袋", type: "藥袋", owner: "阿晴" },
    { id: "doc-2", title: "內科覆診紙", type: "覆診紙", owner: "Maria" },
  ]);

  const counts = useMemo(() => tasks.reduce((acc, task) => ({ ...acc, [task.status]: acc[task.status] + 1 }), { pending: 0, done: 0, skipped: 0 }), [tasks]);

  function addTask(category) {
    setTasks((current) => [{ id: `task-${Date.now()}`, title: `新增${category}任務`, category, time: "今天", assignee: "未指派", status: "pending", note: "可稍後補充時間、負責人和備註" }, ...current]);
    setActive("today");
  }

  function updateTask(id, nextStatus) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status: nextStatus } : task)));
  }

  function confirmCall(label, phone) {
    Alert.alert("確認致電", `是否致電 ${label}？`, [
      { text: "取消", style: "cancel" },
      { text: "致電", onPress: () => Linking.openURL(`tel:${phone}`) },
    ]);
  }

  function addDoc() {
    setDocs((current) => [{ id: `doc-${Date.now()}`, title: "新上傳文件", type: "相片", owner: "你" }, ...current]);
  }

  async function shareEmergencyCard() {
    await Share.share({
      title: "照顧夾緊急卡",
      message: "爸爸緊急資料\n出生年份：1948\n主要情況：高血壓、糖尿病、夜晚間中頭暈\n緊急聯絡：阿晴 9123 4567\n此資料只供緊急照顧參考，不取代醫護判斷。",
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>照顧夾 MVP</Text>
          <Text style={styles.title}>今日照顧工作台</Text>
          <View style={styles.profile}>
            <View style={styles.avatar}><Text style={styles.avatarText}>爸</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>爸爸</Text>
              <Text style={styles.muted}>高血壓、糖尿病、夜晚間中頭暈</Text>
            </View>
            <View style={styles.badge}><Text style={styles.badgeText}>No diagnosis</Text></View>
          </View>
        </View>

        {active === "today" && <Today tasks={tasks} counts={counts} addTask={addTask} updateTask={updateTask} confirmCall={confirmCall} shareEmergencyCard={shareEmergencyCard} />}
        {active === "care" && <Care addTask={addTask} docs={docs} addDoc={addDoc} />}
        {active === "visit" && <Visit docs={docs} addDoc={addDoc} />}
        {active === "family" && <Family />}
        {active === "support" && <Support confirmCall={confirmCall} />}
      </ScrollView>

      <View style={styles.nav}>
        {tabs.map(([id, label, icon]) => (
          <TouchableOpacity key={id} style={[styles.navItem, active === id && styles.navActive]} onPress={() => setActive(id)}>
            <Ionicons name={icon} size={20} color={active === id ? accent : "#687076"} />
            <Text style={[styles.navText, active === id && { color: accent }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function Today({ tasks, counts, addTask, updateTask, confirmCall, shareEmergencyCard }) {
  return <View style={styles.stack}>
    <View style={styles.stats}>{metric("未完成", counts.pending, "#FFF2D8")}{metric("已完成", counts.done, "#E7F6EA")}{metric("略過", counts.skipped, "#EEF0F2")}</View>
    <View style={styles.emergency}><View style={{ flex: 1 }}><Text style={styles.dangerTitle}>緊急卡可離線查看</Text><Text style={styles.dangerText}>大字版資料、999、182 183、家人電話集中一頁。</Text></View><IconButton icon="call" tone="danger" onPress={() => confirmCall("999", "999")} /><IconButton icon="share-outline" onPress={shareEmergencyCard} /></View>
    <View style={styles.actions}>{categories.map((category) => <Chip key={category} label={category} onPress={() => addTask(category)} />)}</View>
    <Text style={styles.sectionTitle}>今日任務</Text>
    {tasks.map((task) => <Task key={task.id} task={task} updateTask={updateTask} />)}
  </View>;
}

function Care({ addTask, docs, addDoc }) {
  return <View style={styles.stack}>
    <Text style={styles.sectionTitle}>照顧模板</Text>
    <View style={styles.grid}>{categories.map((category) => <Template key={category} title={category} onPress={() => addTask(category)} />)}</View>
    <HeaderRow title="文件夾" action="拍照" onPress={addDoc} />
    <Documents docs={docs} />
  </View>;
}

function Visit({ docs, addDoc }) {
  return <View style={styles.stack}>
    <Text style={styles.sectionTitle}>即將覆診</Text>
    <Card><Text style={styles.cardTitle}>5 月 11 日 09:45 內科</Text><Text style={styles.muted}>威爾斯親王醫院 · 陪診：阿晴</Text><Text style={styles.body}>想問醫生：最近夜晚頭暈是否需要跟進？血壓紀錄是否需要調整頻率？</Text></Card>
    <Card><Text style={styles.cardTitle}>5 月 27 日 14:30 糖尿科跟進</Text><Text style={styles.muted}>沙田普通科門診 · 陪診：Maria</Text><Text style={styles.body}>覆核藥袋上的服藥時間。</Text></Card>
    <HeaderRow title="覆診包文件" action="新增" onPress={addDoc} />
    <Documents docs={docs} />
  </View>;
}

function Family() {
  const members = [["阿晴", "Admin", "主要照顧者，可管理成員和資料"], ["細佬", "Family", "可查看任務、文件、緊急卡"], ["Maria", "Helper", "今日任務、藥物提醒、緊急卡"], ["社工 Ms. Chan", "Viewer", "只讀摘要，限時查看"]];
  return <View style={styles.stack}><View style={styles.notice}><Ionicons name="lock-closed-outline" size={22} color={accent} /><Text style={styles.body}>邀請前會顯示對方可查看的資料。敏感資料預設隱藏，所有重要修改會留低紀錄。</Text></View>{members.map(([name, role, detail]) => <Card key={name}><Text style={styles.cardTitle}>{name} · {role}</Text><Text style={styles.muted}>{detail}</Text></Card>)}</View>;
}

function Support({ confirmCall }) {
  return <View style={styles.stack}>
    <View style={styles.emergency}><View style={{ flex: 1 }}><Text style={styles.dangerTitle}>需要即時協助？</Text><Text style={styles.dangerText}>如有即時危險請致電 999。照顧壓力、情緒支援或服務轉介可致電 182 183。</Text></View></View>
    <View style={styles.stats}><TouchableOpacity style={styles.dangerButton} onPress={() => confirmCall("999", "999")}><Text style={styles.dangerButtonText}>999</Text></TouchableOpacity><TouchableOpacity style={styles.lightButton} onPress={() => confirmCall("182 183", "182183")}><Text style={styles.lightButtonText}>182 183</Text></TouchableOpacity></View>
    <Card><Text style={styles.cardTitle}>我而家撐唔住</Text><Text style={styles.muted}>照顧者支援熱線、情緒支援和危機求助入口。</Text></Card>
    <Card><Text style={styles.cardTitle}>需要暫託服務</Text><Text style={styles.muted}>整理長者情況、照顧者壓力和地區，方便求助前講清楚。</Text></Card>
  </View>;
}

function Task({ task, updateTask }) {
  const [label, color, bg] = status[task.status];
  return <Card><View style={styles.row}><Text style={styles.category}>{task.category}</Text><Text style={[styles.pill, { color, backgroundColor: bg }]}>{label}</Text></View><Text style={styles.cardTitle}>{task.title}</Text><Text style={styles.muted}>{task.time} · 負責人：{task.assignee}</Text><Text style={styles.body}>{task.note}</Text><View style={styles.actions}><Chip label="完成" onPress={() => updateTask(task.id, "done")} /><Chip label="略過" onPress={() => updateTask(task.id, "skipped")} /><Chip label="重開" onPress={() => updateTask(task.id, "pending")} /></View></Card>;
}

function Documents({ docs }) { return docs.map((doc) => <Card key={doc.id}><Text style={styles.cardTitle}>{doc.title}</Text><Text style={styles.muted}>{doc.type} · 上傳者：{doc.owner}</Text></Card>); }
function Template({ title, onPress }) { return <TouchableOpacity style={styles.template} onPress={onPress}><Ionicons name="add-circle-outline" size={24} color={accent} /><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>新增提醒、負責人、時間和備註。</Text></TouchableOpacity>; }
function HeaderRow({ title, action, onPress }) { return <View style={styles.row}><Text style={styles.sectionTitle}>{title}</Text><Chip label={action} onPress={onPress} /></View>; }
function Card({ children }) { return <View style={styles.card}>{children}</View>; }
function Chip({ label, onPress }) { return <TouchableOpacity style={styles.chip} onPress={onPress}><Text style={styles.chipText}>{label}</Text></TouchableOpacity>; }
function IconButton({ icon, tone, onPress }) { return <TouchableOpacity style={[styles.iconButton, tone === "danger" && { backgroundColor: "#B91C1C" }]} onPress={onPress}><Ionicons name={icon} size={21} color={tone === "danger" ? "#FFFFFF" : "#7F1D1D"} /></TouchableOpacity>; }
function metric(label, value, bg) { return <View style={[styles.metric, { backgroundColor: bg }]}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F3EC" },
  content: { padding: 18, paddingBottom: 96 },
  header: { gap: 14, marginBottom: 16 },
  kicker: { color: accent, fontSize: 12, fontWeight: "800" },
  title: { color: "#17211D", fontSize: 30, fontWeight: "900", lineHeight: 36 },
  profile: { alignItems: "center", backgroundColor: "#FFFDF8", borderColor: "#E3D8C8", borderRadius: 8, borderWidth: 1, flexDirection: "row", gap: 12, padding: 13 },
  avatar: { alignItems: "center", backgroundColor: "#17372F", borderRadius: 8, height: 54, justifyContent: "center", width: 54 },
  avatarText: { color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
  badge: { backgroundColor: "#E2F3ED", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7 },
  badgeText: { color: accent, fontSize: 12, fontWeight: "800" },
  stack: { gap: 14 },
  stats: { flexDirection: "row", gap: 10 },
  metric: { borderRadius: 8, flex: 1, minHeight: 76, padding: 12 },
  metricValue: { color: "#17211D", fontSize: 27, fontWeight: "900" },
  metricLabel: { color: "#59625E", fontSize: 13, fontWeight: "800" },
  emergency: { alignItems: "center", backgroundColor: "#FEF2F2", borderColor: "#F0B7B7", borderRadius: 8, borderWidth: 1, flexDirection: "row", gap: 10, padding: 13 },
  dangerTitle: { color: "#7F1D1D", fontSize: 17, fontWeight: "900" },
  dangerText: { color: "#6E3333", fontSize: 13, lineHeight: 19 },
  iconButton: { alignItems: "center", backgroundColor: "#FDE4E4", borderRadius: 8, height: 44, justifyContent: "center", width: 44 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#E2F3ED", borderRadius: 8, minHeight: 38, justifyContent: "center", paddingHorizontal: 11 },
  chipText: { color: accent, fontSize: 13, fontWeight: "900" },
  sectionTitle: { color: "#17211D", fontSize: 19, fontWeight: "900" },
  card: { backgroundColor: "#FFFDF8", borderColor: "#E3D8C8", borderRadius: 8, borderWidth: 1, gap: 7, padding: 13 },
  cardTitle: { color: "#17211D", fontSize: 16, fontWeight: "900", lineHeight: 21 },
  muted: { color: "#66706B", fontSize: 13, lineHeight: 19 },
  body: { color: "#3E4943", fontSize: 14, lineHeight: 20 },
  row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 8 },
  category: { color: accent, flex: 1, fontSize: 12, fontWeight: "900" },
  pill: { borderRadius: 8, fontSize: 12, fontWeight: "900", overflow: "hidden", paddingHorizontal: 9, paddingVertical: 5 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  template: { backgroundColor: "#FFFDF8", borderColor: "#E3D8C8", borderRadius: 8, borderWidth: 1, flexBasis: "48%", flexGrow: 1, gap: 7, minHeight: 126, padding: 13 },
  notice: { alignItems: "flex-start", backgroundColor: "#E2F3ED", borderRadius: 8, flexDirection: "row", gap: 10, padding: 13 },
  dangerButton: { alignItems: "center", backgroundColor: "#B91C1C", borderRadius: 8, flex: 1, justifyContent: "center", minHeight: 46 },
  dangerButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  lightButton: { alignItems: "center", backgroundColor: "#FDE4E4", borderRadius: 8, flex: 1, justifyContent: "center", minHeight: 46 },
  lightButtonText: { color: "#7F1D1D", fontSize: 15, fontWeight: "900" },
  nav: { backgroundColor: "#FFFDF8", borderColor: "#E3D8C8", borderTopWidth: 1, bottom: 0, flexDirection: "row", gap: 3, left: 0, paddingBottom: 10, paddingHorizontal: 8, paddingTop: 8, position: "absolute", right: 0 },
  navItem: { alignItems: "center", borderRadius: 8, flex: 1, gap: 3, minHeight: 54, justifyContent: "center" },
  navActive: { backgroundColor: "#E2F3ED" },
  navText: { color: "#687076", fontSize: 11, fontWeight: "900" },
});
