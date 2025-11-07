export const ERROR_CODE_METADATA_KEY = 'custom:errorCode';

export function ErrorCode(code: string): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(ERROR_CODE_METADATA_KEY, code, target, propertyKey);
  };
}

export function getErrorCodeFromMetadata(
  target: unknown,
  propertyKey: string | symbol,
): string | undefined {
  const metaTarget = (target as any)?.constructor?.prototype ?? target;
  return Reflect.getMetadata(
    ERROR_CODE_METADATA_KEY,
    metaTarget,
    propertyKey,
  ) as string | undefined;
}
