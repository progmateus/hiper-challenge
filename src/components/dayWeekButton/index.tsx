import { Box } from "@mui/material"
import { useEffect, useState } from "react"

interface IProps {
    day: string,
    // onClick: () => void,
    id?: string;
    name: string;
    // setListDays: Dispatch<SetStateAction<object[]>>;
    listDays: object[];
}

interface IItem {
    id: string,
    name: string;
    day: string;
}

export default function DayWeekButton(props: any) {
    const { day, name, id, setListDays, listDays, unregister } = props

    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {

        const objeto = document.getElementById(name)


        if (objeto) {
            const alreadyActive = objeto.classList.contains("active");
            let currentArray = listDays

            if (alreadyActive) {
                const newDataArray = currentArray.filter((item: IItem) => item.day !== name)
                setListDays(newDataArray)

                unregister(`${name}_entry_time`, {
                    keepValue: false,
                    keepDefaultValue: false
                })
                unregister(`${name}_departure_time`, {
                    keepValue: false,
                    keepDefaultValue: false
                })

                objeto.classList.remove("active");
            }

            if (!alreadyActive) {
                setListDays([...listDays, { day: name }])
            }

        }

    }

    return (
        <Box

            id={name}
            role="button"
            onClick={handleClick}
            sx={{
                display: "flex",
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: 50,
                bgcolor: "#A9A9A9",
                color: "white",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none"
            }}>
            {day}
        </Box>
    )
}