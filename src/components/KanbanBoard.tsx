"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PlusCircle, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/Navbar";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Task = {
  id: string;
  content: string;
  assignee: string;
  stage: string;
  createdAt: Date;
  deadLine: Date;
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
  const [group, setGroup] = useState<Group | null>(null);

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "A Fazer",
      tasks: [],
    },
    {
      id: "inProgress",
      title: "Em Progresso",
      tasks: [],
    },
    {
      id: "inTesting",
      title: "Em Testes",
      tasks: [],
    },
    {
      id: "done",
      title: "Concluído",
      tasks: [],
    },
  ]);

  const [newTask, setNewTask] = useState({
    content: "",
    assignee: "",
    createdAt: new Date(),
    deadLine: "",
  });

  // Estado para controlar a exibição do popover
  const [open, setOpen] = useState(false);

  const addTask = () => {
    if (newTask.content && newTask.assignee) {
      const updatedColumns = [...columns];
      const now = new Date();
      const deadline = new Date(now);
      deadline.setDate(now.getDate() + parseInt(newTask.deadLine));
      updatedColumns[0].tasks.push({
        id: uuidv4(),
        content: newTask.content,
        assignee: newTask.assignee,
        createdAt: now,
        deadLine: deadline,
        stage: "todo",
      });
      setColumns(updatedColumns);
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
  };

  useEffect(() => {
    async function fetchData() {
      const paramsValue = await id;
      if (!paramsValue) return;

      setGroup({
        id: "1",
        name: "Projeto A",
        members: [
          {
            id: "1",
            name: "Alice Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "2",
            name: "Bob Smith",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          {
            id: "3",
            name: "Charlie Brown",
            avatar: "/placeholder.svg?height=32&width=32",
          },
        ],
      });
    }
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      {group ? (
        <div className="flex-1 p-4 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">
            {group.name || "Kanban Board"}
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
            {/* Combobox para selecionar o responsável */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {newTask.assignee
                    ? group.members.find(
                        (member) => member.id === newTask.assignee
                      )?.name
                    : "Selecione o responsável"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Pesquisar membros..." />
                  <CommandGroup>
                    {group.members.map((member) => (
                      <CommandItem
                        key={member.id}
                        onSelect={() => {
                          setNewTask({ ...newTask, assignee: member.id });
                          setOpen(false);
                        }}
                      >
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
                <div
                  key={column.id}
                  className="bg-gray-100 p-4 rounded-lg w-1/4"
                >
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
                                          {
                                            group.members.find(
                                              (member) =>
                                                member.id === task.assignee
                                            )?.name
                                          }
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Estágio: {task.stage}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Data de criação:{" "}
                                          {task.createdAt.toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Data de conclusão:{" "}
                                          {task.deadLine.toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        <Avatar>
                                          <AvatarImage
                                            src={
                                              group.members.find(
                                                (member) =>
                                                  member.id === task.assignee
                                              )?.avatar || ""
                                            }
                                          />
                                          <AvatarFallback>
                                            {group.members
                                              .find(
                                                (member) =>
                                                  member.id === task.assignee
                                              )
                                              ?.name.slice(0, 2)
                                              .toUpperCase()}
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
      ) : (
        <div className="flex-1 p-4 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Grupo não encontrado</h1>
        </div>
      )}
    </div>
  );
}
