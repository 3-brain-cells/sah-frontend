import React, { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { AvailabilityBlock, DayAvailability } from "../newtypes/types";

const Styled = {
  AvailabilityGrid: styled.div`
    height: 100%;
    user-select: none;
  `,
  HighlightCell: styled.td`
    background-color: rgba(0, 0, 0, 0.3);

    &[data-selected="true"] {
      background-color: #ff0;
    }
  `,
  Table: styled.table`
    table-layout: fixed;
    width: 100%;
  `,
  HeaderCell: styled.th`
    font-size: 0.9rem;
    line-height: 1;
    font-weight: normal;
    padding-bottom: 12px;
  `,
};

export type AvailabilityGridProps = {
  state: DayAvailability[];
  onChange: (state: DayAvailability[]) => void;
  earliestDate: Date;
  latestDate: Date;
  startTimeHour: number;
  startTimeMinute: number;
  endTimeHour: number;
  endTimeMinute: number;
  className?: string;
  style?: React.CSSProperties;
};

type DragState =
  | {
      dragging: false;
    }
  | {
      dragging: true;
      filling: boolean;
    };

function fixDate(dateString: string): Date {
  const rawDate = new Date(dateString);
  return new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
}

function getDateIndex({
  earliestDate,
  dateString,
}: {
  earliestDate: Date;
  dateString: string;
}): number {
  const dateIndexRaw = fixDate(dateString).getTime() - earliestDate.getTime();
  return Math.floor(dateIndexRaw / (1000 * 60 * 60 * 24));
}

export default function AvailabilityGrid({
  state,
  onChange,
  earliestDate,
  latestDate,
  startTimeHour,
  startTimeMinute,
  endTimeHour,
  endTimeMinute,
  style,
  className,
}: AvailabilityGridProps) {
  // Determine the number of days between the earliest and latest dates
  const numDays =
    (latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24);
  const numDaysInt = Math.floor(numDays) + 1;

  // Determine the number of hours between the start and end times
  const numHours =
    endTimeHour - startTimeHour + (endTimeMinute - startTimeMinute) / 60;

  // Convert the number of hours to 30-minute blocks
  const numBlocks = Math.ceil(numHours * 2);

  // Determine the state for the grid
  const gridState = useMemo<boolean[][]>(() => {
    // Initialize the empty state
    const gridState: boolean[][] = [];
    for (let i = 0; i < numDaysInt; i++) {
      gridState.push([]);
      for (let j = 0; j < numBlocks; j++) {
        gridState[i].push(false);
      }
    }

    // Fill in any selected blocks using state
    for (const day of state) {
      // Determine the date index of the date string (number of days since earliest date)
      const dateIndex = getDateIndex({
        earliestDate,
        dateString: day.date,
      });
      for (const block of day.available_blocks) {
        // Determine the block index of the block's start and end times
        const blockIndex =
          (block.start_hour - startTimeHour) * 2 +
          (block.start_minute - startTimeMinute) / 30;

        gridState[dateIndex][blockIndex] = true;
      }
    }

    return gridState;
  }, [
    numDaysInt,
    numBlocks,
    state,
    earliestDate,
    startTimeHour,
    startTimeMinute,
  ]);

  const dragState = useRef<DragState>({ dragging: false });

  function touchOversToGrid(
    touches: React.TouchList
  ): [block: number, day: number][] {
    const gridTouches: [block: number, day: number][] = [];
    for (let i = 0; i < touches.length; ++i) {
      const touch = touches.item(i);
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element !== null && element.classList.contains("highlight-cell")) {
        const block = Number.parseInt(
          element.getAttribute("data-block") ?? "0"
        );
        const day = Number.parseInt(element.getAttribute("data-day") ?? "0");

        gridTouches.push([block, day]);
      }
    }

    return gridTouches;
  }

  function processGridTouches(gridTouches: [block: number, day: number][]) {
    if (!dragState.current.dragging) return;
    const { filling } = dragState.current;

    const stateChanges: [block: number, day: number, value: boolean][] = [];
    for (const [block, day] of gridTouches) {
      const value = gridState[day][block];
      if (value !== filling) {
        stateChanges.push([block, day, filling]);
      }
    }

    // Update the state
    if (stateChanges.length > 0) {
      const stateMap: Map<number, Map<number, boolean>> = new Map();
      for (const [block, day, value] of stateChanges) {
        const dayMap = stateMap.get(day) ?? new Map();
        dayMap.set(block, value);
        stateMap.set(day, dayMap);
      }

      const newState = state.map((dayState) => {
        const dateIndex = getDateIndex({
          earliestDate,
          dateString: dayState.date,
        });
        const dayMap = stateMap.get(dateIndex);
        if (dayMap === undefined) {
          return dayState;
        }
        stateMap.delete(dateIndex);

        // Update the blocks in this date
        let newAvailableBlocks = [...dayState.available_blocks];
        dayMap.forEach((value, block) => {
          let blockStartHour = startTimeHour + Math.floor(block / 2);
          let blockStartMinute = startTimeMinute + (block % 2) * 30;
          if (blockStartMinute === 60) {
            blockStartHour += 1;
            blockStartMinute = 0;
          }

          if (value) {
            const newBlock = {
              start_hour: blockStartHour,
              start_minute: blockStartMinute,
              end_hour: blockStartHour,
              end_minute: blockStartMinute + 30,
            };
            if (newBlock.end_minute === 60) {
              newBlock.end_hour += 1;
              newBlock.end_minute = 0;
            }
            newAvailableBlocks.push(newBlock);
          } else {
            newAvailableBlocks = newAvailableBlocks.filter(
              (block) =>
                block.start_hour !== blockStartHour ||
                block.start_minute !== blockStartMinute
            );
          }
        });
        return {
          date: dayState.date,
          available_blocks: newAvailableBlocks,
        };
      });

      // Process any remaining day state changes
      if (stateMap.size > 0) {
        stateMap.forEach((dayMap, day) => {
          // These should all be fill operations
          const adjustedDate = new Date(
            earliestDate.getTime() + day * (1000 * 60 * 60 * 24)
          );
          // Convert adjustedDate to UTC
          const utcDate = new Date(
            Date.UTC(
              adjustedDate.getFullYear(),
              adjustedDate.getMonth(),
              adjustedDate.getDate(),
              0,
              0,
              0,
              0
            )
          );
          const newAvailableBlocks: AvailabilityBlock[] = [];
          dayMap.forEach((value, block) => {
            let blockStartHour = startTimeHour + Math.floor(block / 2);
            let blockStartMinute = startTimeMinute + (block % 2) * 30;
            if (blockStartMinute === 60) {
              blockStartHour += 1;
              blockStartMinute = 0;
            }

            const newBlock = {
              start_hour: blockStartHour,
              start_minute: blockStartMinute,
              end_hour: blockStartHour,
              end_minute: blockStartMinute + 30,
            };
            if (newBlock.end_minute === 60) {
              newBlock.end_hour += 1;
              newBlock.end_minute = 0;
            }
            newAvailableBlocks.push(newBlock);
          });
          newState.push({
            date: utcDate.toISOString(),
            available_blocks: newAvailableBlocks,
          });
        });
      }
      onChange(newState);
    }
  }

  return (
    <Styled.AvailabilityGrid
      className={className}
      style={style}
      onTouchStart={(e) => {
        // See if any touches are currently on the grid
        const gridTouches = touchOversToGrid(e.touches);

        // If there are no touches on the grid,
        // default to filling in cells
        let filling: boolean;
        if (gridTouches.length === 0) {
          filling = true;
        } else {
          // Otherwise, take the state of the first touch
          const [firstBlock, firstDay] = gridTouches[0];
          filling = !gridState[firstDay][firstBlock];
        }

        dragState.current = { dragging: true, filling };

        // Process any touches that cause state changes
        processGridTouches(gridTouches);
      }}
      onTouchMove={(e) => {
        // See if any touches are currently on the grid
        const gridTouches = touchOversToGrid(e.touches);

        // Process any touches that cause state changes
        processGridTouches(gridTouches);
      }}
      onTouchEnd={(e) => {
        // See if any touches are currently on the grid
        const gridTouches = touchOversToGrid(e.touches);

        // Process any touches that cause state changes
        processGridTouches(gridTouches);
      }}
    >
      <Styled.Table>
        <tbody>
          <tr>
            <th style={{ width: 50 }} />
            {Array.from(Array(numDaysInt).keys()).map((day) => {
              // Get the human-readable date for the day
              const dateString = new Date(
                earliestDate.getTime() + day * 1000 * 60 * 60 * 24
              ).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              // Add a line break after the first comma
              const dateStringSplit = dateString.split(",");
              let dateStringContent;
              if (dateStringSplit.length > 1) {
                dateStringContent = [
                  <React.Fragment key={0}>
                    {dateStringSplit[0]},
                  </React.Fragment>,
                  <br key="br" />,
                  ...dateStringSplit
                    .slice(1)
                    .map((part, index) => (
                      <React.Fragment key={index + 1}>{part}</React.Fragment>
                    )),
                ];
              } else {
                dateStringContent = [dateStringSplit + ","];
              }

              return (
                <Styled.HeaderCell
                  key={day}
                  style={{ width: `${(100 / numDays).toFixed(3)}%` }}
                >
                  {dateStringContent}
                </Styled.HeaderCell>
              );
            })}
          </tr>
          {Array.from(Array(numBlocks).keys()).map((block) => {
            let blockStartHour = startTimeHour + Math.floor(block / 2);
            let blockStartMinute = startTimeMinute + (block % 2) * 30;
            if (blockStartMinute === 60) {
              blockStartHour += 1;
              blockStartMinute = 0;
            }
            const timeDate = new Date(
              earliestDate.getTime() +
                blockStartHour * 1000 * 60 * 60 +
                blockStartMinute * 1000 * 60
            );
            return (
              <tr key={block}>
                <td>
                  {/* Get the human-readable time for this block's start */}
                  {timeDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  })}
                </td>
                {Array.from(Array(numDaysInt).keys()).map((day) => (
                  <Styled.HighlightCell
                    key={day}
                    className="highlight-cell"
                    data-block={block}
                    data-day={day}
                    data-selected={gridState[day][block] ? true : undefined}
                  ></Styled.HighlightCell>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Styled.Table>
    </Styled.AvailabilityGrid>
  );
}
