"use client";

import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  PlusCircle,
  GripVertical,
  UserCircle,
  LogOut,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/contexts/AuthContext";

type Task = {
  id: string;
  content: string;
  assignee: string;
  stage: string;
  createdAt: Date;
  deadLine: Date;
  User: GroupMember;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};
type GroupMember = {
  id: string;
  name: string;
  avatar: string;
};

type Group = {
  id: string;
  name: string;
  members: GroupMember[];
};

export default function KanbanBoard({ id }: { id: string }) {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "A Fazer",
      tasks: [],
    },
    {
      id: "In Progress",
      title: "Em Progresso",
      tasks: [],
    },
    {
      id: "in Testing",
      title: "Em Testes",
      tasks: [],
    },
    {
      id: "Done",
      title: "Concluído",
      tasks: [],
    },
  ]);

  const { user } = useContext(AuthContext);

  const [newTask, setNewTask] = useState({
    content: "",
    assignee: "",
    createdAt: new Date(),
    deadLine: "",
  });

  const [group, setGroup] = useState<Group | null>(null);

  async function fetchGroup() {
    const paramsValue = await id;
    if (!paramsValue) return;

    const res = await fetch(`/api/group/${paramsValue}`);

    const data = await res.json();
    setGroup(data);

    if (data.tasks.length === 0) return;

    const todo = [] as Task[];
    const inProgress = [] as Task[];
    const inTesting = [] as Task[];
    const done = [] as Task[];
    console.log(data);
    data.tasks.forEach(
      (task: {
        id: string;
        name: string;
        stage: string;
        assignee: string;
        createdAt: Date;
        deadLine: Date;
        content: string;
        User: GroupMember;
      }) => {
        switch (task.stage) {
          case "todo":
            todo.push(task);
            break;
          case "inProgress":
            inProgress.push(task);
            break;
          case "inTesting":
            inTesting.push(task);
            break;
          case "done":
            done.push(task);
            break;
        }
      }
    );

    setColumns([
      {
        id: "todo",
        title: "A Fazer",
        tasks: todo,
      },
      {
        id: "inProgress",
        title: "Em Progresso",
        tasks: inProgress,
      },
      {
        id: "inTesting",
        title: "Em Testes",
        tasks: inTesting,
      },
      {
        id: "done",
        title: "Concluído",
        tasks: done,
      },
    ]);
  }

  const addTask = async () => {
    if (newTask.content && newTask.assignee) {
      const now = new Date();
      const deadline = new Date(now);
      deadline.setDate(now.getDate() + parseInt(newTask.deadLine));
      const task = {
        content: newTask.content,
        assignee: newTask.assignee,
        createdAt: now,
        deadLine: deadline,
        stage: "todo",
        groupId: +id,
        userId: user?.id,
      };

      fetch(`/api/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }).then(() => fetchGroup());

      setNewTask({
        content: "",
        assignee: "",
        createdAt: new Date(),
        deadLine: "",
      });
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColIndex = columns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIndex = columns.findIndex(
      (col) => col.id === destination.droppableId
    );

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : Array.from(destCol.tasks);

    const [movedTask] = sourceTasks.splice(source.index, 1);

    movedTask.stage = destCol.id;

    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = [...columns];
    newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
    newColumns[destColIndex] = { ...destCol, tasks: destTasks };

    setColumns(newColumns);

    //update task
    const task = columns[sourceColIndex].tasks.find(
      (task) => task.id === movedTask.id
    );
    if (task) {
      task.stage = destCol.id;

      fetch(`/api/task/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {group?.name || "Kanban Board"}
        </h1>
        <div className="mb-4 flex space-x-2">
          <Input
            type="text"
            placeholder="Nova tarefa"
            value={newTask.content}
            onChange={(e) =>
              setNewTask({ ...newTask, content: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Responsável"
            value={newTask.assignee}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Dias até a conclusão"
            value={newTask.deadLine}
            onChange={(e) =>
              setNewTask({ ...newTask, deadLine: e.target.value })
            }
          />
          <Button onClick={addTask}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tarefa
          </Button>
        </div>

        {/* Quadro Kanban */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {columns.map((column) => (
              <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-1/3">
                <h2 className="font-semibold mb-4">{column.title}</h2>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[100px]"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="bg-white select-none cursor-move">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p>{task.content}</p>
                                      <p className="text-sm text-gray-500">
                                        {task.assignee}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Estágio: {task.stage}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Data de criação:{" "}
                                        {new Date(
                                          task.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Data de conclusão:{" "}
                                        {new Date(
                                          task.deadLine
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Criador: {task.User.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      <Avatar>
                                        <AvatarImage
                                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${task.assignee}`}
                                        />
                                        <AvatarFallback>
                                          {task.assignee}
                                        </AvatarFallback>
                                      </Avatar>
                                      <GripVertical className="text-gray-400 ml-2 cursor-pointer" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
