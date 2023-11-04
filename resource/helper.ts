export function checkUniqueness(str: string) {
  const pattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return pattern.test(str);
}
