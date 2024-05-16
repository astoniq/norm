export type Either<A, B> = Partial<A> & Partial<B> & (A | B);

export type MaybePromise<T> = T | Promise<T>;