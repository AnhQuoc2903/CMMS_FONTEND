import { Statistic, Tag } from "antd";
import dayjs from "dayjs";

export default function SLACountdown({ dueAt, paused }) {
  if (!dueAt) return null;

  const now = dayjs();
  const due = dayjs(dueAt);
  const diff = due.diff(now, "second");

  if (diff <= 0) {
    return <Tag color="red">SLA OVERDUE</Tag>;
  }

  return (
    <Statistic.Countdown
      title={paused ? "SLA Paused" : "SLA Remaining"}
      value={due.valueOf()}
      format="HH:mm:ss"
    />
  );
}
