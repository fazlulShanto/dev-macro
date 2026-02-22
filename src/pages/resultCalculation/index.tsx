'use client'

import { useState } from 'react'
import {
  semester11,
  semester12,
  semester21,
  semester22,
  semester31,
  semester32,
  semester41,
  semester42,
} from './sample.data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Course {
  course_code: string
  title: string
  credit: number
  lg: string
  gp: number
}

interface SemesterStats {
  cgpa: number
  totalCredits: number
}

interface SemesterData {
  name: string
  courses: Course[]
  stats: SemesterStats
}

export const calculateSemesterStats = (courses: Course[]): SemesterStats => {
  const totalCredits = courses.reduce((sum, course) => sum + course.credit, 0)
  const totalGradePoints = courses.reduce(
    (sum, course) => sum + course.credit * course.gp,
    0
  )
  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

  return {
    cgpa: Math.round(cgpa * 100) / 100,
    totalCredits,
  }
}

export const ResultCalculation = () => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterData | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const semesters = [
    { name: 'Semester 1.1', courses: semester11 },
    { name: 'Semester 1.2', courses: semester12 },
    { name: 'Semester 2.1', courses: semester21 },
    { name: 'Semester 2.2', courses: semester22 },
    { name: 'Semester 3.1', courses: semester31 },
    { name: 'Semester 3.2', courses: semester32 },
    { name: 'Semester 4.1', courses: semester41 },
    { name: 'Semester 4.2', courses: semester42 },
  ]

  const semesterStats = semesters.map((sem) => ({
    name: sem.name,
    courses: sem.courses,
    stats: calculateSemesterStats(sem.courses),
  }))

  const allCourses = semesters.flatMap((sem) => sem.courses)
  const overallStats = calculateSemesterStats(allCourses)

  const handleCardClick = (semester: SemesterData) => {
    setSelectedSemester(semester)
    setIsDialogOpen(true)
  }

  return (
    <div className="result-calculation-container">
      <div className="header">
        <h1>Academic Performance Analysis</h1>
        <p>CGPA Calculation Summary</p>
      </div>

      <div className="semesters-grid">
        {semesterStats.map((sem, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={() => handleCardClick(sem)}
          >
            <CardHeader className="pb-2 px-6">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {sem.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-2 pt-2 space-y-2">
              {/* CGPA Section */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {sem.stats.cgpa.toFixed(2)}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    GPA
                  </p>
                </div>
                <div className="text-right mb-1">
                  <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                    {sem.stats.totalCredits.toFixed(1)}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Credits
                  </p>
                </div>
              </div>

              {/* Progress Bar Decoration (Optional) */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full opacity-80" 
                  style={{ width: `${(sem.stats.cgpa / 4) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overall-stats mt-8 bg-white">
        <Card className="w-full max-w-xl mx-auto shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Cumulative Performance
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Overall academic standing across all semesters
                </p>
              </div>
              
              <div className="flex gap-12">
                <div className="text-center">
                  <p className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {overallStats.cgpa.toFixed(2)}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
                    CGPA
                  </p>
                </div>
                
                <div className="h-20 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                
                <div className="text-center flex flex-col justify-center">
                  <p className="text-4xl font-semibold text-slate-700 dark:text-slate-300">
                    {overallStats.totalCredits.toFixed(1)}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
                    Credits
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" bg-white sm:max-w-[50vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSemester?.name} - Course Details</DialogTitle>
          </DialogHeader>
          {selectedSemester && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    CGPA
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedSemester.stats.cgpa.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Total Credits
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedSemester.stats.totalCredits.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        Course Code
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        Title
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        Credit
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        Grade
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        GP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSemester.courses.map((course, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">
                          {course.course_code}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {course.title}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                          {course.credit.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">
                          {course.lg}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                          {course.gp.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}