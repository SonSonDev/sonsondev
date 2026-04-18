'use client'

import React, { useEffect, useRef, useState } from 'react'
import { NavArrowUp, NavArrowDown } from 'iconoir-react'
import Loader from '@/components/ui/Loader'
import '@/assets/stylesheets/super-table.scss'

// ── Types ────────────────────────────────────────────────────────────────────

export type SortOrder = 'asc' | 'desc'

export interface TableSort {
  id: string | null
  order: SortOrder | null
}

export interface Column<T> {
  id: string
  label?: string
  sortable?: boolean
  ellipsis?: boolean
  width?: number | string
  fitContent?: boolean
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => React.ReactNode
}

export type TableRow = {
  group?: string
  clickable?: boolean
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  sort?: TableSort
  onSortChange?: (sort: TableSort) => void
  onRowClick?: (row: T) => void
  placeholder?: string
  loading?: boolean
  stickyStart?: number
  stickyEnd?: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function colWidth (col: { width?: number | string }): string | undefined {
  if (col.width === undefined) return undefined
  return typeof col.width === 'number' ? `${col.width}%` : col.width
}

function isFirstOfGroup<T> (data: T[], row: T, index: number): boolean {
  const r = row as TableRow
  return !!r.group && data.findIndex(item => (item as TableRow).group === r.group) === index
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SuperTable<T> ({
  columns,
  data,
  sort,
  onSortChange,
  onRowClick,
  placeholder = '',
  loading = false,
  stickyStart,
  stickyEnd,
}: Props<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scrolledLeft, setScrolledLeft] = useState(false)
  const [scrolledRight, setScrolledRight] = useState(false)
  const hasSticky = !!stickyStart || !!stickyEnd

  useEffect(() => {
    if (!hasSticky) return
    const el = wrapperRef.current
    if (!el) return
    const check = () => {
      setScrolledLeft(el.scrollLeft > 0)
      setScrolledRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    check()
    el.addEventListener('scroll', check)
    window.addEventListener('resize', check)
    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [hasSticky])

  function handleSortClick (col: Column<T>) {
    if (!col.sortable || !onSortChange) return
    let order: SortOrder = 'asc'
    if (sort?.id === col.id && sort.order === 'asc') order = 'desc'
    else if (sort?.id === col.id && sort.order === 'desc') order = 'asc'
    onSortChange({ id: col.id, order })
  }

  function getStickyStyle (index: number): React.CSSProperties {
    if (!hasSticky) return {}
    if (stickyStart && index < stickyStart) {
      const left = columns.slice(0, index).map(c => colWidth(c)).filter(Boolean).join(' + ') || '0px'
      return { left: `calc(${left})` }
    }
    if (stickyEnd && columns.length - index <= stickyEnd) {
      const right = columns.slice(index + 1).map(c => colWidth(c)).filter(Boolean).join(' + ') || '0px'
      return { right: `calc(${right})` }
    }
    return {}
  }

  function getStickyClass (index: number): string {
    if (!hasSticky) return ''
    if (stickyStart && index < stickyStart) return `st-sticky-start${scrolledLeft ? ' st-overlapping' : ''}`
    if (stickyEnd && columns.length - index <= stickyEnd) return `st-sticky-end${scrolledRight ? ' st-overlapping' : ''}`
    return ''
  }

  function getHeadClass (col: Column<T>): string {
    return [
      col.align ?? '',
      col.fitContent ? 'st-fit-content' : '',
      getStickyClass(columns.indexOf(col)),
    ].filter(Boolean).join(' ')
  }

  function getCellClass (col: Column<T>): string {
    return [
      col.align ?? '',
      col.ellipsis ? 'st-ellipsis' : '',
      col.fitContent ? 'st-fit-content' : '',
      getStickyClass(columns.indexOf(col)),
    ].filter(Boolean).join(' ')
  }

  function getHeadStyle (col: Column<T>): React.CSSProperties {
    const w = colWidth(col)
    return { ...(w ? { width: w, minWidth: w } : {}), ...getStickyStyle(columns.indexOf(col)) }
  }

  const showHead = columns.some(c => c.label)
  const isEmpty = !loading && data.length === 0

  const shadowLeftWidth = stickyStart
    ? `calc(${columns.slice(0, stickyStart).map(c => colWidth(c)).filter(Boolean).join(' + ') || '0px'})`
    : '0px'
  const shadowRightWidth = stickyEnd
    ? `calc(${columns.slice(columns.length - stickyEnd).map(c => colWidth(c)).filter(Boolean).join(' + ') || '0px'})`
    : '0px'

  return (
    <div className={`st${hasSticky ? ' st--sticky' : ''}${scrolledLeft ? ' st--scrolled' : ''}`}>
      <div className="st__body">
        {!isEmpty ? (
          <div className="st__wrapper" ref={wrapperRef}>
            <table>
              {showHead && (
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className={getHeadClass(col)}
                        style={getHeadStyle(col)}
                      >
                        <span
                          className={col.sortable ? `st-sortable${sort?.id === col.id ? ` st-sortable--${sort.order}` : ''}` : undefined}
                          onClick={() => handleSortClick(col)}
                        >
                          {col.label}
                          {col.sortable && (
                            <span className="st-sort-icon" aria-hidden>
                              {sort?.id === col.id && sort.order === 'asc' && <NavArrowUp />}
                              {sort?.id === col.id && sort.order === 'desc' && <NavArrowDown />}
                              {sort?.id !== col.id && <NavArrowDown className="st-sort-icon--neutral" />}
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={columns.length} className="st__loader">
                      <Loader />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {data.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {isFirstOfGroup(data, row, rowIndex) && (
                        <tr className="st-group-row">
                          <td colSpan={stickyStart || columns.length}>
                            {(row as TableRow).group}
                          </td>
                          {stickyStart && <td colSpan={columns.length - stickyStart} />}
                        </tr>
                      )}
                      <tr
                        className={`st-data-row${(row as TableRow).clickable ? ' st-clickable' : ''}`}
                        onClick={() => (row as TableRow).clickable && onRowClick?.(row)}
                      >
                        {columns.map((col, j) => (
                          <td
                            key={`${rowIndex}-${j}`}
                            className={getCellClass(col)}
                            style={getStickyStyle(j)}
                          >
                            {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.id] ?? '')}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              )}
            </table>
            {hasSticky && (
              <div className="st__shadow-wrapper">
                <div
                  className="st__shadow-left"
                  style={{ width: shadowLeftWidth, opacity: scrolledLeft ? 1 : 0 }}
                />
                <div
                  className="st__shadow-right"
                  style={{ width: shadowRightWidth, opacity: scrolledRight ? 1 : 0 }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="st__placeholder">{placeholder}</div>
        )}
      </div>
    </div>
  )
}
