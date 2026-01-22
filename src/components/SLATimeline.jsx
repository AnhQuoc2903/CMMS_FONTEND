import { Timeline, Tag, Spin, Empty } from "antd";
import {
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const SLA_MAP = {
  BREACH: {
    color: "red",
    icon: <ExclamationCircleOutlined />,
    label: "SLA Breached",
  },
  CLOSE_LATE: {
    color: "red",
    icon: <ExclamationCircleOutlined />,
    label: "Closed Late",
  },
};

export default function SLATimeline({ data = [], loading }) {
  if (loading) return <Spin />;

  if (!data.length) {
    return <Empty description="No SLA issues recorded" />;
  }

  return (
    <Timeline
      items={data.map((item) => {
        const meta = SLA_MAP[item.type] || {};
        return {
          dot: meta.icon || <ClockCircleOutlined />,
          color: meta.color || "blue",
          children: (
            <>
              <Tag color={meta.color || "blue"}>{meta.label || item.type}</Tag>
              <div style={{ marginTop: 4 }}>
                {new Date(item.at).toLocaleString()}
              </div>
              {item.note && (
                <div style={{ marginTop: 4, opacity: 0.8 }}>{item.note}</div>
              )}
            </>
          ),
        };
      })}
    />
  );
}
