import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createCachedSelector } from 're-reselect';

import { api } from '../api';
import { Store } from '../store';
import { Release, Status, StatusType, StatusUpdate, Task, TaskDefinition } from '../types/task';

type TasksState = {
    loaded: boolean;
    releases: Record<string, Release>;
    taskStatuses: Record<string, Record<string, Status>>;
};

const initialState: TasksState = {
    loaded: false,
    releases: {},
    taskStatuses: {},
};

// ======
// Thunks
// ======

export const loadReleases = createAsyncThunk('tasks/loadReleases', api.releases.get);
export const createRelease = createAsyncThunk('tasks/createRelease', api.releases.create);
export const deleteRelease = createAsyncThunk('tasks/deleteRelease', api.releases.delete);
export const updateRelease = createAsyncThunk('tasks/updateRelease', api.releases.update);
export const addTasks = createAsyncThunk('tasks/addTasks', api.releases.addTasks);
export const removeTasks = createAsyncThunk('tasks/removeTasks', api.releases.removeTasks);
export const updateTasks = createAsyncThunk(
    'tasks/updateTasks',
    async ({
        releaseId,
        tasks,
    }: {
        releaseId: string;
        tasks: { id: string; partial: Partial<Omit<TaskDefinition, 'id'>> }[];
    }) =>
        api.releases.updateTasks({
            releaseId,
            taskIds: tasks.map((task) => task.id),
            updates: tasks.map((task) => task.partial),
        })
);

// =============
// Slice/actions
// =============

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        loadStatuses: (state, action: PayloadAction<StatusUpdate[]>) => {
            action.payload.forEach(({ releaseId, taskId, status }) => {
                // Ensure the release & task are valid and known to the client
                if (!Object.prototype.hasOwnProperty.call(state.releases, releaseId)) {
                    return;
                }
                if (
                    !Object.prototype.hasOwnProperty.call(state.releases[releaseId].tasks, taskId)
                ) {
                    return;
                }

                if (!Object.prototype.hasOwnProperty.call(state.taskStatuses, releaseId)) {
                    state.taskStatuses[releaseId] = {};
                }

                state.taskStatuses[releaseId][taskId] = status;
            });
        },
    },
    extraReducers: {
        [loadReleases.fulfilled.type]: (state, action) => {
            if (loadReleases.fulfilled.match(action)) {
                state.loaded = true;
                state.releases = action.payload;
            }
        },
        [createRelease.fulfilled.type]: (state, action) => {
            if (createRelease.fulfilled.match(action)) {
                state.releases[action.payload.id] = action.payload;
            }
        },
        [deleteRelease.pending.type]: (state, action) => {
            if (deleteRelease.pending.match(action)) {
                delete state.releases[action.meta.arg];
                delete state.taskStatuses[action.meta.arg];
            }
        },
        [updateRelease.pending.type]: (state, action) => {
            if (updateRelease.pending.match(action)) {
                const { id } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.releases, id)) {
                    state.releases[id] = {
                        ...state.releases[id],
                        ...action.meta.arg.partial,
                    };
                }
            }
        },
        [updateRelease.fulfilled.type]: (state, action) => {
            if (updateRelease.fulfilled.match(action)) {
                state.releases[action.payload.id] = action.payload;
            }
        },
        [addTasks.fulfilled.type]: (state, action) => {
            if (addTasks.fulfilled.match(action)) {
                const { releaseId } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.releases, releaseId)) {
                    action.payload.tasks.forEach((task) => {
                        state.releases[releaseId].tasks[task.id] = task;
                    });
                }
            }
        },
        [removeTasks.pending.type]: (state, action) => {
            if (removeTasks.pending.match(action)) {
                const { releaseId, taskIds } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.releases, releaseId)) {
                    taskIds.forEach((taskId) => {
                        delete state.releases[releaseId].tasks[taskId];
                    });
                }
                if (Object.prototype.hasOwnProperty.call(state.taskStatuses, releaseId)) {
                    taskIds.forEach((taskId) => {
                        delete state.taskStatuses[releaseId][taskId];
                    });
                }
            }
        },
        [updateTasks.pending.type]: (state, action) => {
            if (updateTasks.pending.match(action)) {
                const { releaseId, tasks } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.releases, releaseId)) {
                    const release = state.releases[releaseId];
                    tasks.forEach(({ id, ...partial }) => {
                        if (Object.prototype.hasOwnProperty.call(release.tasks, id)) {
                            release.tasks[id] = {
                                ...release.tasks[id],
                                ...partial,
                            };
                        }
                    });
                }
            }
        },
        [updateTasks.fulfilled.type]: (state, action) => {
            if (updateTasks.fulfilled.match(action)) {
                const { releaseId } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.releases, releaseId)) {
                    action.payload.tasks.forEach((task) => {
                        state.releases[releaseId].tasks[task.id] = task;
                    });
                }
            }
        },
    },
});

export default slice.reducer;
export const { loadStatuses } = slice.actions;

// =========
// Selectors
// =========

export type ReleaseHeader = { id: string; name: string; site: string };
export type ReleaseHeaderGroup = { site: string; items: Omit<ReleaseHeader, 'site'>[] };

/**
 * Extracts the list of all release Names/IDs
 */
export const allReleaseHeaders = createSelector(
    (state: Store) => state.tasks.releases,
    (releases): ReleaseHeader[] =>
        Object.values(releases).map((release) => ({
            name: release.name,
            id: release.id,
            site: release.site,
        }))
);

/**
 * Extracts the list of all release header groups,
 * sorted and grouped by the site and sorted by the release name.
 */
export const allReleaseHeaderGroups = createSelector(
    allReleaseHeaders,
    (releaseHeaders): ReleaseHeaderGroup[] => {
        // Transform the list of release headers to:
        // - group by the site
        // - sort each release by its id (date of creation)
        // - sort each site by its name
        const siteMap: Record<string, Omit<ReleaseHeader, 'site'>[]> = {};
        releaseHeaders.forEach(({ id, name, site }) => {
            if (!Object.prototype.hasOwnProperty.call(siteMap, site)) {
                siteMap[site] = [];
            }
            siteMap[site].push({ id, name });
        });

        // Sort each release within each site
        const sites = Object.keys(siteMap);
        sites.forEach((site) => {
            siteMap[site] = siteMap[site].sort((a, b) => a.id.localeCompare(b.id));
        });

        // Sort each site, and return an array in the order of the sites
        const sortedSites = sites.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        return sortedSites.map((site) => ({ site, items: siteMap[site] }));
    }
);

/**
 * Extracts a flattened list of release headers in the same order as the nav
 * with its un-flattened release groups
 */
export const allFlattenedReleaseHeaders = createSelector(
    allReleaseHeaderGroups,
    (releaseGroups): ReleaseHeader[] => {
        const flattened: ReleaseHeader[] = [];
        releaseGroups.forEach(({ site, items }) =>
            items.forEach(({ id, name }) => {
                flattened.push({ id, name, site });
            })
        );
        return flattened;
    }
);

export const extractTaskStatuses = (store: Store, props: { id: string }): Record<string, Status> =>
    store.tasks.taskStatuses[props.id] ?? {};

export type TaskStatusOverview = {
    finished: number;
    running: number;
    stopped: number;
};

/**
 * Extracts the task status overview for a single release
 * using a cached selector from re-reselect.
 * Expects a prop object in the form of { id: string },
 * where id is the release ID.
 *
 * Note: using createCachedSelector is *very* intentional here.
 * Normal reselect selectors can only hold a single item in their cache,
 * and this selector is intended to be used
 * by each sidebar item with their own release id.
 * As a result, we need to use the re-reselect library here
 * to hold a cache item for each cache key given (release ID in this case).
 * More info at https://github.com/toomuchdesign/re-reselect
 */
export const releaseTaskStatusOverview = createCachedSelector(
    [extractTaskStatuses],
    (statuses): TaskStatusOverview => {
        let finished = 0;
        let running = 0;
        let stopped = 0;
        Object.values(statuses).forEach((status) => {
            switch (status.status) {
                case StatusType.FINISHED:
                    finished += 1;
                    break;
                case StatusType.RUNNING:
                case StatusType.WAITING:
                case StatusType.WAITING_FOR_PROXY:
                    running += 1;
                    break;
                case StatusType.FAILED:
                case StatusType.CANCELLED:
                    stopped += 1;
                    break;
                default:
            }
        });
        return { finished, running, stopped };
    }
    // Use the release ID as the cache key
)((_state: Store, props: { id: string }) => props.id);

/**
 * Gets all tasks in a release, in some arbitrary order
 */
export const allTasks = createSelector(
    [
        (state: Store, props: { id: string }) => state.tasks.releases[props.id] ?? null,
        (state: Store, props: { id: string }) => state.tasks.taskStatuses[props.id] ?? {},
    ],
    (release: Release | null, taskStatuses: Record<string, Status>): Task[] => {
        if (release === null) {
            return [];
        }

        return Object.keys(release.tasks).map((id) => ({
            definition: release.tasks[id],
            status: taskStatuses[id] ?? null,
        }));
    }
);
