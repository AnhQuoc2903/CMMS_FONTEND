/* eslint-disable react-hooks/set-state-in-effect */
import { Table, Tag, Button, Space } from "antd";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../api/notification.api";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../socket";

export default function NotificationsPage() {
  const [data, setData] = useState([]);
  const nav = useNavigate();

  const load = async () => {
    const res = await getNotifications();
    setData(res.data);
  };

  useEffect(() => {
    load();

    const socket = getSocket();
    if (!socket) return;

    const onNew = () => load();
    socket.on("notification:new", onNew);

    return () => socket.off("notification:new", onNew);
  }, []);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          {!r.isRead && (
            <Button
              size="small"
              onClick={async () => {
                await markAsRead(r._id);
                load();
              }}
            >
              Mark read
            </Button>
          )}
          <Button size="small" type="link" onClick={() => nav(r.link)}>
            Open
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={async () => {
            await markAllAsRead();
            load();
          }}
        >
          Mark all as read
        </Button>
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        rowClassName={(r) => (!r.isRead ? "unread-row" : "")}
      />
    </>
  );
}
