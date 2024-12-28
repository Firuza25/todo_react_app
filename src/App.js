import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [taskSummary, setTaskSummary] = useState("");
 
  const [editIndex, setEditIndex] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
 
  const [deadline, setDeadline] = useState("");
  const [taskState, setTaskState] = useState("not done");
  const [filterStatus, setFilterStatus] = useState("All"); // в начале мы видим все таски которые добабили
  // const[doneOrnotDone, setDoneOrnotDone] = useState["Only done taks"];

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  function createTask() {
    const newTask = {
      title: taskTitle,
      summary: taskSummary,
      state: taskState,
      deadline: deadline,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    saveTasks([...tasks, newTask]);
    resetModalFields();
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i!==index);//уже проверяем мы измененную таск и потом уж сохранять
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem("tasks");
    let tasks = JSON.parse(loadedTasks);
    if (tasks) {
      setTasks(tasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function resetModalFields() {
    setTaskTitle("");
    setTaskSummary("");
    setDeadline("");
    setEditIndex(null);
    setOpened(false);
    setTaskState("not done");
    
  }
  function editedScreenModel(index) {
    const task = tasks[index];
    setTaskTitle(task.title || "");
    setTaskSummary(task.summary || "");
    setTaskState(task.state || "Not done");
    setDeadline(task.deadline || "");
    setEditIndex(index);
    setOpened(true);
  }

  function saveEditedTask() {
    const updatedTask = {
      title: taskTitle,
      summary: taskSummary,
      state: taskState,
      deadline: deadline,
    };

    const updatedTasks = tasks.map((task, i) =>
      i === editIndex ? updatedTask : task
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    resetModalFields();
  }

  function toggleFilterStatus() {
    const modes = ["All", "Done", "Doing right now", "Not done"];
    const nextMode = modes[(modes.indexOf(filterStatus) + 1) % modes.length];
    setFilterStatus(nextMode);
  }


  // function toggleFilterDoneOrNotDoneTaks() {
  //   const modes2 = ["Only done taks", "Only not done tasks"];
  //   const nextnextMode = modes2[(modes2.indexOf(filterStatus) + 1) % modes2.length];
  //   setDoneOrnotDone(nextnextMode);
  // }



  const visibleTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((task) => task.state === filterStatus);


    // const newSoreedTasks =
    // doneOrnotDone === "Only done taks"
    //   ? tasks
    //   : tasks.filter((task) => task.state === doneOrnotDone);

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={editIndex === null ? "New Task" : "Edit Task"}
            withCloseButton={false}
            onClose={resetModalFields}
            centered
          >
            <TextInput
              mt={"md"}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={"title"}
              required
              label={"Title"}
            />
            <TextInput
              mt={"md"}
              value={taskSummary}
              onChange={(e) => setTaskSummary(e.target.value)}
              placeholder={"summary"}
              label={"Summary"}
            />
            <Select
              label="State"
              data={["Done", "Not done", "Doing right now"]}
              value={taskState}
              onChange={setTaskState}
              mt="md"
            />
            <TextInput
              type="date"
              label="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              mt="md"
            />
            <Group mt={"md"} position={"apart"}>
              <Button onClick={resetModalFields} variant={"subtle"}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  editIndex === null ? createTask() : saveEditedTask()}
              >
                {editIndex === null ? "Create Task" : "Save Changes"}
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            <Group mt="sm">
              <Button onClick={toggleFilterStatus}
               color={filterStatus === 'active' ? 'blue' : 'green'}
               >
                Filter: {filterStatus}
              </Button>
            </Group>

            {/* <Group mt="sm">
              <Button onClick={toggleFilterDoneOrNotDoneTaks}
               color={filterStatus === 'active' ? 'blue' : 'green'}
               >
                Filter: {filterStatus}
              </Button>
            </Group> */}


            {visibleTasks.length > 0 ? ( visibleTasks.map((task, index) => (
                <Card withBorder key={index} mt={"sm"}>
                  <Group position={"apart"}>
                    <Text weight={"bold"}>{task.title}</Text>w
                    <Group>
                      <ActionIcon
                        onClick={() => editedScreenModel(index)}
                        color={"blue"}
                        variant={"transparent"}
                      >
                        <Edit />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Group>


                  <Text color={"dimmed"} size={"md"} mt={"sm"}>
                    {task.summary ? task.summary : "you didn't add summary for this task"}
                  </Text>

                  <Text size={"sm"} mt={"sm"}>
                    State: {task.state}
                  </Text>
                  <Text size={"sm"} mt={"sm"}>
                    Deadline: {task.deadline || "пожалуй дедлайна нет"}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
