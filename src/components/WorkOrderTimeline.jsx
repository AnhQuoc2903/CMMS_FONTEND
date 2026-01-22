import { Timeline, Tag, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { ACTION_LABEL } from "../constants/workOrderTimeline";

export default function WorkOrderTimeline({ data, loading }) {
  if (loading) return <Spin />;

  if (!data || data.length === 0) {
    return <Empty description="No timeline data" />;
  }

  return (
    <Timeline mode="left">
      {data.map((e) => (
        <Timeline.Item key={e._id}>
          <div style={{ fontWeight: 600 }}>
            {ACTION_LABEL[e.action] || e.action}
          </div>

          <div style={{ marginTop: 4 }}>
            <Tag color="blue">{e.performedBy?.role}</Tag>
            {e.performedBy?.name}
          </div>

          <div style={{ fontSize: 12, color: "#888" }}>
            {dayjs(e.createdAt).format("DD/MM/YYYY HH:mm")}
          </div>

          {e.note && (
            <div style={{ marginTop: 6, fontStyle: "italic" }}>
              Note: {e.note}
            </div>
          )}
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
