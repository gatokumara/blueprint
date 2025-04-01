import { Blueprint, Addon } from '.'

export interface FetchAddon {
    request<T extends FetchAddon, Props, Result>(this: T & Blueprint<T, Props, Result>): this
}

export const fetchAddon : Addon<FetchAddon> = {
    core: {
        request() {
            return this
        }
    }
}

export default fetchAddon