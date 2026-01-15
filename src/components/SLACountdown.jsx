/* eslint-disable react-hooks/purity */
import { Alert, Tag } from "antd";
import { useEffect, useState } from "react";

export default function SLACountdown({ dueAt, paused }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, [paused]);

  if (!dueAt) return null;

  const diff = new Date(dueAt) - now;
  const hours = Math.ceil(diff / 3600000);

  if (paused) return <Tag color="orange">SLA Paused</Tag>;

  if (diff <= 0) return <Alert type="error" message="SLA VIOLATED" />;

  return <Alert type="info" message={`SLA Remaining: ${hours} hours`} />;
}
