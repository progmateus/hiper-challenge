import { TimePicker } from '@mui/x-date-pickers-pro';
import { useEffect, useState, memo } from 'react';
import { Box, Button, Checkbox, Container, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import dayjs from "dayjs"
import { useForm } from "react-hook-form"

function ListDayItem(props) {

    const { index, register, setValue, getFieldState, watch } = props;

    const [entry_time, setEntryTime] = useState(index.entry_time)
    const [departure_time, setDeparture_time] = useState(index.departure_time)


    const onChangeTimerEntry = (newValue) => {
        setEntryTime(newValue)
        setValue(`${index.day}_entry_time`, newValue)
    }

    const onChangeTimerDeparture = (newValue) => {
        setDeparture_time(newValue)
        setValue(`${index.day}_departure_time`, newValue)
    }

    return (
        <ListItem>
            <Box
                display="flex"
                sx={{
                    alignItems: "center",
                    justifyContent: "right",
                    m: "0.2rem 0"
                }}
            >

                <Typography variant="inherit" minWidth="3rem">
                    {
                        index.day[0].toUpperCase() + index.day.substring(1, 3)

                    }
                </Typography>

                <TimePicker
                    label="inicio"
                    value={watch(`${index.day}_entry_time`)}
                    onChange={(newValue) => {
                        onChangeTimerEntry(newValue)
                    }}
                    renderInput={(params) =>
                        <TextField
                            name={`${index.day}_entry_time`}
                            size="small"
                            sx={{ m: "0 0.5rem" }}
                            {...register(`${index.day}_entry_time`)}
                            {...params} />
                    }
                />

                <Typography variant="inherit">
                    Até
                </Typography>

                <TimePicker
                    label="fim"
                    value={watch(`${index.day}_departure_time`)}
                    onChange={(newValue) => {
                        onChangeTimerDeparture(newValue)
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...register(`${index.day}_departure_time`)}
                            name={`${index.day}_departure_time`}
                            sx={{ m: "0 0.5rem" }}
                            size="small"
                            {...params}
                        />
                    }
                />

            </Box>
        </ListItem>
    )
}

export default memo(ListDayItem)