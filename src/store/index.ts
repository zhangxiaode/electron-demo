export const baseStore = import.meta.globEager('./base.ts')['./base.ts'].default
export const userStore = import.meta.globEager('./user.ts')['./user.ts'].default
export const permissionStore = import.meta.globEager('./permission.ts')['./permission.ts'].default