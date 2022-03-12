import { AxiosRequestConfig } from 'axios';
import { ipcRenderer } from 'electron';

import { LogEntry } from './types/log';
import { Profile, ProfileGroup } from './types/profile';
import { Release, TaskDefinition } from './types/task';
import { ApiResult } from '../ipc';

export class ApiError extends Error {
    message: string;

    details: string;

    constructor(message: string, details: string) {
        super(message);
        this.message = message;
        this.details = details;
        this.name = 'ApiError';
    }
}

// sendRequest sends an HTTP request to the backend
export async function sendRequest<T>(
    path: string,
    config?: AxiosRequestConfig | undefined
): Promise<T> {
    const result: ApiResult<T> = await ipcRenderer.invoke('backend-api', path, config ?? {});
    if (result.type === 'success') {
        return result.response;
    }

    throw new ApiError(result.message, result.details);
}

/**
 * Helper functions for communicating with the application backend via HTTP
 */
export const api = {
    releases: {
        // GET /releases
        get: async (): Promise<Record<string, Release>> =>
            sendRequest('/releases', { method: 'GET' }),

        // POST /releases
        create: async ({ name, site }: { name: string; site: string }): Promise<Release> =>
            sendRequest('/releases', { method: 'POST', data: { name, site } }),

        // DELETE /releases/:release
        delete: async (id: string): Promise<void> =>
            sendRequest(`/releases/${id}`, { method: 'DELETE' }),

        // PATCH /releases/:release
        update: async ({
            id,
            partial,
        }: {
            id: string;
            partial: Partial<Omit<Release, 'id'>>;
        }): Promise<Release> => sendRequest(`/releases/${id}`, { method: 'PATCH', data: partial }),

        // POST /releases/:release/tasks/batch
        addTasks: async ({
            releaseId,
            tasks,
        }: {
            releaseId: string;
            tasks: Omit<TaskDefinition, 'id' | 'number'>[];
        }): Promise<{ tasks: TaskDefinition[] }> =>
            sendRequest(`/releases/${releaseId}/tasks/batch`, {
                method: 'POST',
                data: { tasks },
            }),

        // DELETE /releases/:release/tasks/batch
        removeTasks: async ({
            releaseId,
            taskIds,
        }: {
            releaseId: string;
            taskIds: string[];
        }): Promise<void> =>
            sendRequest(`/releases/${releaseId}/tasks/batch`, {
                method: 'DELETE',
                data: { taskIds },
            }),

        // PATCH /releases/:release/tasks/batch
        updateTasks: async ({
            releaseId,
            taskIds,
            updates,
        }: {
            releaseId: string;
            taskIds: string[];
            updates: Partial<Omit<TaskDefinition, 'id'>>[];
        }): Promise<{ tasks: TaskDefinition[] }> =>
            sendRequest(`/releases/${releaseId}/tasks/batch`, {
                method: 'PATCH',
                data: {
                    taskIds,
                    updates,
                },
            }),

        // POST /releases/:release/tasks/start
        startTasks: async ({
            releaseId,
            taskIds,
        }: {
            releaseId: string;
            taskIds: string[];
        }): Promise<void> =>
            sendRequest(`/releases/${releaseId}/tasks/start`, {
                method: 'POST',
                data: { taskIds },
            }),

        // POST /releases/:release/tasks/stop
        stopTasks: async ({
            releaseId,
            taskIds,
        }: {
            releaseId: string;
            taskIds: string[];
        }): Promise<void> =>
            sendRequest(`/releases/${releaseId}/tasks/stop`, {
                method: 'POST',
                data: { taskIds },
            }),

        // GET /releases/:release/tasks/:task/log
        pollLog: async ({
            releaseId,
            taskId,
            after,
        }: {
            releaseId: string;
            taskId: string;
            after?: string;
        }): Promise<{ entries: LogEntry[] }> =>
            sendRequest(`/releases/${releaseId}/tasks/${taskId}/log`, {
                method: 'GET',
                params: {
                    after,
                },
            }),

        // Status update polling omitted
        // since it is handled in the main process
    },
    profileGroups: {
        // GET /profile_groups
        get: async (): Promise<Record<string, ProfileGroup>> =>
            sendRequest('/profile_groups', { method: 'GET' }),

        // POST /profile_groups
        create: async ({ name }: { name: string }): Promise<ProfileGroup> =>
            sendRequest('/profile_groups', { method: 'POST', data: name }),

        // DELETE /profile_groups/:profile_group
        delete: async (id: string): Promise<void> =>
            sendRequest(`/profile_groups/${id}`, { method: 'DELETE' }),

        // PATCH /profile_groups/:profile_group
        update: async ({
            id,
            partial,
        }: {
            id: string;
            partial: Partial<Omit<ProfileGroup, 'id'>>;
        }): Promise<ProfileGroup> =>
            sendRequest(`/profile_groups/${id}`, { method: 'PATCH', data: partial }),

        // POST /profile_groups/:profile_group/profiles/batch
        addProfiles: async ({
            profileGroupId,
            profiles,
        }: {
            profileGroupId: string;
            profiles: Omit<Profile, 'id'>[];
        }): Promise<{ profiles: Profile[] }> =>
            sendRequest(`/profile_groups/${profileGroupId}/profiles/batch`, {
                method: 'POST',
                data: { profiles },
            }),

        // DELETE /profile_groups/:profile_group/profiles/batch
        removeProfiles: async ({
            profileGroupId,
            profileIds,
        }: {
            profileGroupId: string;
            profileIds: string[];
        }): Promise<void> =>
            sendRequest(`/profile_groups/${profileGroupId}/profiles/batch`, {
                method: 'DELETE',
                data: { profileIds },
            }),

        // PATCH /profile_groups/:profile_group/profiles/:profile
        updateProfile: async ({
            profileGroupId,
            profileId,
            update,
        }: {
            profileGroupId: string;
            profileId: string;
            update: Partial<Omit<Profile, 'id'>>;
        }): Promise<Profile> =>
            sendRequest(`/profile_groups/${profileGroupId}/profiles/${profileId}`, {
                method: 'PATCH',
                data: update,
            }),

        // POST /profile_groups/import
        import: async ({ filepath }: { filepath: string }): Promise<{ imported: ProfileGroup[] }> =>
            sendRequest(`/profile_groups/import`, {
                method: 'POST',
                data: filepath,
            }),

        // POST /profile_groups/export
        export: async ({ filepath }: { filepath: string }): Promise<void> =>
            sendRequest(`/profile_groups/export`, {
                method: 'POST',
                data: filepath,
            }),
    },
};
