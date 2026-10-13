export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (Object.keys(context).length) {
    console.error("[app-error]", context, error);
  } else {
    console.error(error);
  }
}
