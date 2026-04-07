export const hashPassword = (password: string): Promise<string> => {
  return Bun.password.hash(password)
}

export const verifyPassword = (password: string, hash: string): Promise<boolean> => {
  return Bun.password.verify(password, hash)
}
