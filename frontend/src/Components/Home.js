import React, { useEffect } from "react";
import Popup from 'reactjs-popup';

export default function Home({user}) {

    //setting states for form
    const [taskDesc,setTaskDesc] = React.useState('');
    const [date,setDate] = React.useState('2023-10-18T05:45');

    //state for displaying tasks
    const [data,setData] = React.useState();

    //states for popup
    const [open,setOpen] = React.useState(false);
    const close = () => setOpen(false);


    //New Task object
    const newTask = {
        taskDesc: taskDesc,
        date: date,
        complete: false
    }

    //pass the new task to the server
    function handleSubmit(e) {
        e.preventDefault();

        //get the user id from the cookie
        const userId = user.id;
        const accessToken = user.token;

        fetch(`http://localhost:8080/user/${userId}/addTask`, ({
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(newTask)
        }))
        .then(res => {
            if (res.status === 200) {
                alert('Task Created!');
            } else {
                alert('Something went wrong :(');
            }
        })
        .catch(err => console.log(err));
    }

    //convert format of datetime for backend
    function convertDate(d) {
        let dArr = d.split('');
        dArr.splice(10,1,' ')
        return dArr.join('');
    }

    //Display tasks on page load
    useEffect(() => {
        const dataFetch = async () => {
            const data = await (
                await fetch(`http://localhost:8080/user/${user.id}/getTasks`, ({
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                }))
            ).json();

            setData(data);
        };
        dataFetch();
    }, [user.id, user.token]);

    //temporary function to ensure I am always working with an array thats not null or undefined
    function tf() {
        const arr = [];
        if (data) {
            data.forEach(element => {
                arr.push(element);
            });
        }
        return arr;   
    }

    return (
        <section id="home" className="flex flex-row w-75 h-75 overflow-clip">
            <div className="container w-1/2 bg-gray-100 mx-auto flex px-10-py-30 md:flex-col flex-col justify-center items-center overflow-auto">
                <div className="bg-blue-400 w-full items-center justify-center">
                    <Popup position={"right top"}
                        trigger={<button className="button">Add Task</button>}>
                        <div className="bg-gray-500 lg:w-full h-full md:w-full lg:h-4/5 flex flex-col md:mx-auto w-full md:py-4 text-lg font-bold place">
                            <form onSubmit={handleSubmit} className="flex flex-col md:py-4 text-lg">
                                <label>
                                    Task Description
                                </label>
                                <textarea
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                />
                                <label>
                                    Date
                                </label>
                                <input type="datetime-local"
                                    value={convertDate(date)}
                                    onChange={(e) => setDate(e.target.value)}/>
                                <button type="submit" value="addTask">Add New Task</button>
                            </form>
                        </div>
                    </Popup>
                </div>
                <div className="bg-orange-300">
                    {tf().map((task) => {
                        return (
                        <p key={task.taskNumber}>
                            {task.taskNumber} 
                            {task.taskDesc}
                            {task.date}
                            {task.complete}
                            </p>
                            );
                    })}
                </div>
            </div>
            <div className="container w-1/2 bg-orange-100 mx-auto flex px-10-py-30 md:flex-row flex-col justify-center items-center"></div>
            
        </section>
    );
}