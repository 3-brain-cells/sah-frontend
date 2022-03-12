import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import createCachedSelector from 're-reselect';

import { api } from '../api';
import { Store } from '../store';
import { Profile, ProfileGroup } from '../types/profile';

type ProfilesState = {
    loaded: boolean;
    groups: Record<string, ProfileGroup>;
};

const initialState: ProfilesState = {
    loaded: false,
    groups: {},
};

// ======
// Thunks
// ======

export const loadProfileGroups = createAsyncThunk(
    'profiles/loadProfileGroups',
    api.profileGroups.get
);
export const createProfileGroup = createAsyncThunk(
    'profiles/createProfileGroup',
    api.profileGroups.create
);
export const deleteProfileGroup = createAsyncThunk(
    'profiles/deleteProfileGroup',
    api.profileGroups.delete
);
export const updateProfileGroup = createAsyncThunk(
    'profiles/updateProfileGroup',
    api.profileGroups.update
);
export const addProfiles = createAsyncThunk('profiles/addProfiles', api.profileGroups.addProfiles);
export const removeProfiles = createAsyncThunk(
    'profiles/removeProfiles',
    api.profileGroups.removeProfiles
);
export const updateProfile = createAsyncThunk(
    'profiles/updateProfile',
    api.profileGroups.updateProfile
);

// =============
// Slice/actions
// =============

const slice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {},
    extraReducers: {
        [loadProfileGroups.fulfilled.type]: (state, action) => {
            if (loadProfileGroups.fulfilled.match(action)) {
                state.loaded = true;
                state.groups = action.payload;
            }
        },
        [createProfileGroup.fulfilled.type]: (state, action) => {
            if (createProfileGroup.fulfilled.match(action)) {
                state.groups[action.payload.id] = action.payload;
            }
        },
        [deleteProfileGroup.pending.type]: (state, action) => {
            if (deleteProfileGroup.pending.match(action)) {
                delete state.groups[action.meta.arg];
            }
        },
        [updateProfileGroup.pending.type]: (state, action) => {
            if (updateProfileGroup.pending.match(action)) {
                const { id } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.groups, id)) {
                    state.groups[id] = {
                        ...state.groups[id],
                        ...action.meta.arg.partial,
                    };
                }
            }
        },
        [updateProfileGroup.fulfilled.type]: (state, action) => {
            if (updateProfileGroup.fulfilled.match(action)) {
                state.groups[action.payload.id] = action.payload;
            }
        },
        [addProfiles.fulfilled.type]: (state, action) => {
            if (addProfiles.fulfilled.match(action)) {
                const { profileGroupId } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.groups, profileGroupId)) {
                    action.payload.profiles.forEach((profile) => {
                        state.groups[profileGroupId].profiles[profile.id] = profile;
                    });
                }
            }
        },
        [removeProfiles.pending.type]: (state, action) => {
            if (removeProfiles.pending.match(action)) {
                const { profileGroupId, profileIds } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.groups, profileGroupId)) {
                    profileIds.forEach((profileId) => {
                        delete state.groups[profileGroupId].profiles[profileId];
                    });
                }
            }
        },
        [updateProfile.pending.type]: (state, action) => {
            if (updateProfile.pending.match(action)) {
                const { profileGroupId, profileId, update } = action.meta.arg;
                if (Object.prototype.hasOwnProperty.call(state.groups, profileGroupId)) {
                    const profileGroup = state.groups[profileGroupId];
                    if (Object.prototype.hasOwnProperty.call(profileGroup.profiles, profileId)) {
                        profileGroup.profiles[profileId] = {
                            ...profileGroup.profiles[profileId],
                            ...update,
                        };
                    }
                }
            }
        },
    },
});

export default slice.reducer;

// =========
// Selectors
// =========

export type ProfileGroupHeader = { id: string; name: string };

/**
 * Extracts the list of all profile group Names/IDs,
 * sorted by the profile group name.
 */
export const allProfileGroupHeaders = createSelector(
    (state: Store) => state.profiles.groups,
    (profileGroups): ProfileGroupHeader[] =>
        Object.values(profileGroups)
            .map((profileGroup) => ({
                name: profileGroup.name,
                id: profileGroup.id,
            }))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
);

/**
 * Extracts the number of profiles in each profile group.
 * Uses a cached selector from re-reselect.
 */
export const profileGroupProfileCount = createCachedSelector(
    [(state: Store, props: { id: string }) => state.profiles.groups[props.id] ?? null],
    (profileGroup): number => Object.keys(profileGroup?.profiles ?? {}).length
    // Use the profile group ID as the cache key
)((_state: Store, props: { id: string }) => props.id);

/**
 * Gets all profiles in a profile group, in some arbitrary order
 */
export const allProfiles = createSelector(
    (state: Store, props: { id: string }) => state.profiles.groups[props.id] ?? null,
    (profileGroup: ProfileGroup | null): Profile[] => {
        if (profileGroup === null) {
            return [];
        }

        return Object.values(profileGroup.profiles);
    }
);
