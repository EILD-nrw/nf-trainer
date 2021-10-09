import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router'
import CheckboxResponseHandler from '../Components/CheckboxResponseHandler'
import HintContainer from '../Components/HintContainer'
import PrevNextNavigation from '../Components/PrevNextNavigation'
import SampleSolution from '../Components/SampleSolution'
import TrainerHeader from '../Components/Subcomponents/TrainerHeader'
import TrainerSubtaskDescription from '../Components/Subcomponents/TrainerSubtaskDescription'
import TrainerTaskDescription from '../Components/Subcomponents/TrainerTaskDescription'
import Table from '../Components/Table'
import tasks from '../Tasks'

interface ParamTypes {
  id: string
}

export default function PrimaryKeys () {
  // Get task from url param
  const { id } = useParams<ParamTypes>()
  const task = tasks.find(task => task.id === Number(id))

  // Redirect to index if there is no task with the given id
  if (!task) return <Redirect to="/" />

  // Task Variables
  const taskKeys = Object.keys(task.tableData[0])
  const primaryKeys = task.primaryKeys

  // Component State
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)

  function evaluateEntries () {
    if (selectedEntries.length === primaryKeys.length && selectedEntries.every(entry => primaryKeys.includes(entry))) return true
    return false
  }

  function handleSubmit () {
    if (evaluateEntries()) {
      setMessage('Korrekt!')
      setIsEnabled(true)
    } else {
      setMessage('Leider falsch!')
    }
  }

  return (
    <div className="space-y-4">
      <TrainerHeader>Primärschlüssel</TrainerHeader>
      <TrainerTaskDescription>{task.description}</TrainerTaskDescription>
      <Table tableData={task.tableData}/>
      <div className="flex flex-col items-center space-y-4">
      <TrainerSubtaskDescription>Bestimmen Sie alle eindeutigen Schlüssel!</TrainerSubtaskDescription>
        <div className="p-4 border shadow-md">
          <h1 className="font-bold">Schlüssel</h1>
          <CheckboxResponseHandler entryList={taskKeys} selectedEntries={selectedEntries} setSelectedEntries={setSelectedEntries} useAccent={true} />
        </div>
        <button className="px-4 py-2 bg-th-red hover:bg-red-600 text-white text-lg font-semibold border shadow-md rounded-md cursor-pointer block mx-auto" onClick={() => handleSubmit()}>Auswerten</button>
        <HintContainer functionalDependencies={task.functionalDependencies} />
        <SampleSolution >
          <p>{primaryKeys.join(', ')}</p>
        </SampleSolution>
        <p className="text-l font-bold text-center">{message}</p>
      </div>
      <PrevNextNavigation prev={`/tasks/${id}/functionalDependencies`} next={`/tasks/${id}/functionalDependencyTypes`} nextIsEnabled={isEnabled} />
    </div>
  )
}
