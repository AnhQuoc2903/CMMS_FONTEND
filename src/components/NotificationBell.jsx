/* eslint-disable react-hooks/set-state-in-effect */
import { Badge, Dropdown, List, Button, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../api/notification.api";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../socket";

const { Text } = Typography;

export default function NotificationBell() {
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);
  const nav = useNavigate();

  const load = async () => {
    const [n, c] = await Promise.all([getNotifications(), getUnreadCount()]);
    setList(n.data.slice(0, 5));
    setCount(c.data.count);
  };

  useEffect(() => {
    load();

    const socket = getSocket();
    if (!socket) return;

    const onNew = (noti) => {
      setList((prev) => {
        if (prev.some((n) => n._id === noti._id)) return prev;
        return [noti, ...prev].slice(0, 5);
      });
      setCount((c) => c + 1);
    };

    socket.on("notification:new", onNew);

    // fallback polling
    const t = setInterval(load, 60000);

    return () => {
      socket.off("notification:new", onNew);
      clearInterval(t);
    };
  }, []);

  const onClick = async (item) => {
    if (!item.isRead) {
      await markAsRead(item._id);
      setCount((c) => Math.max(c - 1, 0));
    }
    nav(item.link);
  };

  const menu = (
    <div style={{ width: 320 }}>
      <List
        dataSource={list}
        locale={{ emptyText: "No notifications" }}
        renderItem={(item) => (
          <List.Item
            onClick={() => onClick(item)}
            style={{
              cursor: "pointer",
              background: item.isRead ? "#fff" : "#e6f4ff",
            }}
          >
            <List.Item.Meta
              title={<Text strong={!item.isRead}>{item.title}</Text>}
              description={item.message}
            />
          </List.Item>
        )}
      />
      <Button type="link" block onClick={() => nav("/notifications")}>
        View all
      </Button>
    </div>
  );

  return (
    <Dropdown dropdownRender={() => menu} trigger={["click"]}>
      <Badge count={count} size="small">
        <BellOutlined style={{ fontSize: 20 }} />
      </Badge>
    </Dropdown>
  );
}
