import { Box, Button, Checkbox, Container, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DayWeekButton from './components/dayWeekButton';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import ListDayItem from './components/ListDayItem';
import { useForm } from "react-hook-form"
import { api } from './services/api';


interface IRequestDay {
  day: string;
  worker_id: string;
  entry_time: string;
  departure_time: string;
}

const responseMocked = [
  {
    "id": "f6c368f4-0bfe-4f34-80e8-d8c6e1120172",
    "worker_id": "d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23",
    "day": "segunda-feira",
    "entry_time": "12:00",
    "departure_time": "15:00",
    "created_at": "2023-02-28T08:18:56.889Z",
    "updated_at": "2023-02-28T08:18:56.889Z"
  },
  {
    "id": "e643283a-0186-4889-91a2-b56e9eb9c9ba",
    "worker_id": "d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23",
    "day": "terca-feira",
    "entry_time": "12:00",
    "departure_time": "15:00",
    "created_at": "2023-02-28T08:18:57.006Z",
    "updated_at": "2023-02-28T08:18:57.006Z"
  },
  {
    "id": "d5979508-fee9-4eec-8d3f-a96c5d897091",
    "worker_id": "d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23",
    "day": "quarta-feira",
    "entry_time": "12:00",
    "departure_time": "15:00",
    "created_at": "2023-02-28T08:18:57.068Z",
    "updated_at": "2023-02-28T08:18:57.068Z"
  },
  {
    "id": "76b30e14-2985-4747-afb4-02fecfc839f8",
    "worker_id": "d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23",
    "day": "quinta-feira",
    "entry_time": "12:00",
    "departure_time": "15:00",
    "created_at": "2023-02-28T08:18:57.167Z",
    "updated_at": "2023-02-28T08:18:57.167Z"
  },
  {
    "id": "1b634d5e-da24-4884-9efb-e9a7ab266bbf",
    "worker_id": "d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23",
    "day": "sexta-feira",
    "entry_time": "12:00",
    "departure_time": "15:00",
    "created_at": "2023-02-28T08:18:57.188Z",
    "updated_at": "2023-02-28T08:18:57.188Z"
  }
]

var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

function App() {
  const [listDays, setListDays] = useState<any>([])
  const [dayItem, setDayItem] = useState([])
  const defaultValues = [];

  const { register, watch, handleSubmit, formState: { errors }, getValues, getFieldState, setValue, unregister } = useForm();


  useEffect(() => {

    api.get("/workdays/d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23")
      .then((response) => {

        for (let workday of response.data) {

          const newEntry_time = transformInvalidTime(workday.entry_time)
          const newDeparture_time = transformInvalidTime(workday.departure_time)

          setValue(`${workday.day}_entry_time`, dayjs(newEntry_time, "HH: mm"))
          setValue(`${workday.day}_departure_time`, dayjs(newDeparture_time, "HH: mm"))
        }

        setListDays(response.data)
      })

  }, [])


  const handleChangeSelect = () => {

  }

  const veifyIsActive = (id: string) => {
    const objeto = document.getElementById(id)

    if (objeto) {
      objeto.classList.add("active");
      return true
    }
  }

  const transformInvalidTime = (value: string) => {
    const [, second] = value.split(":")
    if (!second[1]) {
      const newValue = `${value}0`
      return newValue
    }
    return value
  }


  const onSubmit = () => {

    const allValues = getValues();
    const paramsFormatted: IRequestDay[] = [];
    const worker_id = "d5eb9708-8f9f-4b2d-a5b0-5612e2b56c23"

    for (let value in allValues) {

      const day = value.split("_")[0];

      if (value !== "active_hour_job" && value !== "send_on_next_turn") {
        const entry_hour = dayjs(watch(`${day}_entry_time`)).get("hour")
        const entry_minute = dayjs(watch(`${day}_entry_time`)).get("minute")
        const entry_time = `${entry_hour}:${entry_minute}`


        const departure_hour = dayjs(watch(`${day}_departure_time`)).get("hour")
        const departure_minute = dayjs(watch(`${day}_departure_time`)).get("minute")
        const departure_time = `${departure_hour}:${departure_minute}`


        const achado = paramsFormatted.find((item) => item.day === day)

        if (!achado) {
          paramsFormatted.push({
            day: value.split("_")[0],
            worker_id: worker_id,
            entry_time: entry_time,
            departure_time: departure_time
          })
        }
      }
    }


    api.put("/workdays/", {
      worker_id: worker_id,
      active_hour_job: getValues("active_hour_job"),
      send_on_next_turn: getValues("send_on_next_turn"),
      workdays: paramsFormatted
    })

    window.location.reload();

  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Container fixed sx={{ pt: "8rem", pb: "4rem" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box >

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box >
                <Typography variant="h6" > Configuração jornada de trabalho </Typography>
                <Box>
                  <Checkbox
                    id="active_hour_job"
                    sx={{ pl: 0 }}
                    size="small"
                    {...register("active_hour_job")}
                  />
                  Ativar horário de trabalho
                </Box>

                <Box>
                  <Typography mb="4px" variant="h6" > Configuração jornada de trabalho </Typography>

                  <Select
                    labelId="send_on_next_turn-label"
                    id="send_on_next_turn"
                    {...register("send_on_next_turn")}

                    fullWidth
                    sx={{ height: "2.5rem" }}
                    defaultValue="abortar"
                    label="Age"
                    onChange={(e) => { console.log("Mudou: ", e.target.value) }}
                  >
                    <MenuItem value={"abortar"}>Abortar</MenuItem>
                    <MenuItem value="enviar no proximo expediente">Enviar no próximo expediente</MenuItem>
                  </Select>
                </Box>
              </Box>

            </Box>

            <Box display="flex" justifyContent="center">
              <Box
                display="flex"
                mt="2rem"
                justifyContent="space-between"
                width="30rem"
              >

                <DayWeekButton
                  day="D"
                  name="domingo"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}
                />

                <DayWeekButton
                  day="S"
                  name="segunda-feira"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}
                />

                <DayWeekButton
                  day="T"
                  name="terca-feira"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}
                />

                <DayWeekButton
                  day="Q"
                  name="quarta-feira"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}
                />

                <DayWeekButton
                  day="Q"
                  name="quinta-feira"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}

                />

                <DayWeekButton
                  day="S"
                  name="sexta-feira"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}
                />

                <DayWeekButton
                  day="S"
                  name="sabado"
                  setListDays={setListDays}
                  listDays={listDays}
                  unregister={unregister}
                />
              </Box>
            </Box>



          </Box>

          {
            listDays && listDays.length > 0 && (
              <Box display="flex" justifyContent="center">
                <List>
                  {
                    listDays.map((index: any) => {
                      const alreadyExists = veifyIsActive(index.day)
                      return (
                        <ListDayItem
                          key={Math.random()}
                          index={index}
                          register={register}
                          getFieldState={getFieldState}
                          setValue={setValue}
                          watch={watch}
                        />
                      )
                    })
                  }
                </List>
              </Box>

            )
          }

          <Box>
            <Button
              variant="contained"
              type="submit"
            >
              Salvar
            </Button>
          </Box>
        </form>

      </Container>
    </LocalizationProvider>

  );
}

export default App;
