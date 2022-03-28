import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router'
import FunctionalDependencyHandler from '../UI/FunctionalDependencyHandler'
import HintContainer from '../UI/HintContainer'
import PrevNextNavigation from '../UI/PrevNextNavigation'
import SampleSolution from '../UI/SampleSolution'
import TrainerHeader from '../UI/TrainerHeader'
import TrainerSubtaskDescription from '../UI/TrainerSubtaskDescription'
import TrainerTaskDescription from '../UI/TrainerTaskDescription'
import Table from '../UI/Table'
import tasks from '../../Tasks'

interface ParamTypes {
  id: string
}

export default function FunctionalDependencyTypes () {
  // Get task from url param
  const { id } = useParams<ParamTypes>()
  const task = tasks.find(task => task.id === Number(id))
  const tableData = task?.hasViolatingColumns ? task?.firstNormalFormTableData : task?.tableData

  // Throw error and redirect back if an error occurs
  if (!tableData) {
    console.error('No suitable tableData found!')
    return <Redirect to="/" />
  }

  // Redirect to index if there is no task with the given id
  if (!task) return <Redirect to="/" />

  // Task Variables
  const functionalDependencies = task.functionalDependencies

  // Component State
  const [selectedTypes, setSelectedTypes] = useState(Array(functionalDependencies.length).fill('voll'))
  const [message, setMessage] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)

  function evaluateEntries (): boolean {
    for (const index in functionalDependencies) {
      if (functionalDependencies[index].type !== selectedTypes[index]) return false
    }
    return true
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
      <TrainerHeader>Typen der funktionalen Abhängigkeiten</TrainerHeader>
      <TrainerTaskDescription>{task.description}</TrainerTaskDescription>
      <Table tableData={tableData}/>
      <div className="flex flex-col items-center space-y-4">
        <TrainerSubtaskDescription>Wählen Sie den jeweiligen Typ der funktionalen Abhängigkeiten aus!</TrainerSubtaskDescription>
        <FunctionalDependencyHandler functionalDependencies={functionalDependencies} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
        <button className="px-4 py-2 bg-th-red hover:bg-red-600 text-white text-lg font-semibold border shadow-md rounded-md cursor-pointer block mx-auto" onClick={() => handleSubmit()}>Auswerten</button>
        <HintContainer functionalDependencies={task.functionalDependencies} primaryKeys={task.primaryKeys} />
        <SampleSolution >
          {task.functionalDependencies.map((dependency, index) => {
            const dependencyString = `${dependency.primaryKeys.join(', ')} ➔ ${dependency.columns.join(', ')} : ${dependency.type}`
            return <p key={index}>{dependencyString}</p>
          })}
        </SampleSolution>
        <p className="text-l font-bold text-center">{message}</p>
      </div>
      <PrevNextNavigation prev={`/tasks/${id}/primaryKeys`} next={`/tasks/${id}/secondNormalForm`} nextIsEnabled={isEnabled} />
    </div>
  )
}
