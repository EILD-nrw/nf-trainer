import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import BooleanResponseHandler from '../UI/BooleanResponseHandler'
import PrevNextNavigation from '../UI/PrevNextNavigation'
import SampleSolution from '../UI/SampleSolution'
import TrainerHeader from '../UI/TrainerHeader'
import TrainerSubtaskDescription from '../UI/TrainerSubtaskDescription'
import TrainerTaskDescription from '../UI/TrainerTaskDescription'
import Table from '../UI/Table'
import tasks from '../../Tasks'

export default function FirstNormalForm () {
  // Get task from url param
  const { id } = useParams<ParamTypes>()
  const task = tasks.find(task => task.id === Number(id))

  // Redirect to index if there is no task with the given id
  if (!task) return <Redirect to="/" />
  const nextPage = task.hasViolatingColumns ? `/tasks/${id}/violatingColumns` : `/tasks/${id}/functionalDependencies`

  const [message, setMessage] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)

  function handleResponse (response: boolean) {
    if (response !== task?.hasViolatingColumns) {
      setMessage('Korrekt!')
      setIsEnabled(true)
    } else {
      setMessage('Leider falsch!')
    }
  }

  return (
    <div className="space-y-4">
      <TrainerHeader>Erste Normalform</TrainerHeader>
      <TrainerTaskDescription>{task.description}</TrainerTaskDescription>
      <Table tableData={task.tableData}/>
      <TrainerSubtaskDescription>Befindet sich die Tabelle in der ersten Normalform?</TrainerSubtaskDescription>
      <BooleanResponseHandler responseHandler={handleResponse} />
      <SampleSolution >
        {task.hasViolatingColumns ? <p>Nein</p> : <p>Ja</p>}
      </SampleSolution>
      <p className="text-l font-bold text-center">{message}</p>
      <PrevNextNavigation prev="/tasks" next={nextPage} nextIsEnabled={isEnabled} />
    </div>
  )
}

interface ParamTypes {
  id: string
}