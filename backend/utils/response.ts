export const response = (status: number, message: string, data?: any) => {
  return { status, body: { message, data } };
};
