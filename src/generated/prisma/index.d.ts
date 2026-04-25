/**
 * Client
 **/

import * as runtime from './runtime/client.js'
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>

/**
 * Model ProjectState
 *
 */
export type ProjectState = $Result.DefaultSelection<Prisma.$ProjectStatePayload>
/**
 * Model TaskState
 *
 */
export type TaskState = $Result.DefaultSelection<Prisma.$TaskStatePayload>
/**
 * Model AcceptanceState
 *
 */
export type AcceptanceState = $Result.DefaultSelection<Prisma.$AcceptanceStatePayload>
/**
 * Model SettlementState
 *
 */
export type SettlementState = $Result.DefaultSelection<Prisma.$SettlementStatePayload>
/**
 * Model AuditLog
 *
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model IdempotencyKey
 *
 */
export type IdempotencyKey = $Result.DefaultSelection<Prisma.$IdempotencyKeyPayload>
/**
 * Model Project
 *
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProjectPhase
 *
 */
export type ProjectPhase = $Result.DefaultSelection<Prisma.$ProjectPhasePayload>
/**
 * Model ProjectMilestone
 *
 */
export type ProjectMilestone = $Result.DefaultSelection<Prisma.$ProjectMilestonePayload>
/**
 * Model ProjectTask
 *
 */
export type ProjectTask = $Result.DefaultSelection<Prisma.$ProjectTaskPayload>
/**
 * Model ProjectRisk
 *
 */
export type ProjectRisk = $Result.DefaultSelection<Prisma.$ProjectRiskPayload>
/**
 * Model ProjectMember
 *
 */
export type ProjectMember = $Result.DefaultSelection<Prisma.$ProjectMemberPayload>
/**
 * Model ProjectStatusLog
 *
 */
export type ProjectStatusLog = $Result.DefaultSelection<Prisma.$ProjectStatusLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more ProjectStates
 * const projectStates = await prisma.projectState.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more ProjectStates
   * const projectStates = await prisma.projectState.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>)
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void
  ): PrismaClient

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  ): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs
      }
    >
  >

  /**
   * `prisma.projectState`: Exposes CRUD operations for the **ProjectState** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectStates
   * const projectStates = await prisma.projectState.findMany()
   * ```
   */
  get projectState(): Prisma.ProjectStateDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.taskState`: Exposes CRUD operations for the **TaskState** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more TaskStates
   * const taskStates = await prisma.taskState.findMany()
   * ```
   */
  get taskState(): Prisma.TaskStateDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.acceptanceState`: Exposes CRUD operations for the **AcceptanceState** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AcceptanceStates
   * const acceptanceStates = await prisma.acceptanceState.findMany()
   * ```
   */
  get acceptanceState(): Prisma.AcceptanceStateDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.settlementState`: Exposes CRUD operations for the **SettlementState** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SettlementStates
   * const settlementStates = await prisma.settlementState.findMany()
   * ```
   */
  get settlementState(): Prisma.SettlementStateDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AuditLogs
   * const auditLogs = await prisma.auditLog.findMany()
   * ```
   */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.idempotencyKey`: Exposes CRUD operations for the **IdempotencyKey** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more IdempotencyKeys
   * const idempotencyKeys = await prisma.idempotencyKey.findMany()
   * ```
   */
  get idempotencyKey(): Prisma.IdempotencyKeyDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.projectPhase`: Exposes CRUD operations for the **ProjectPhase** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectPhases
   * const projectPhases = await prisma.projectPhase.findMany()
   * ```
   */
  get projectPhase(): Prisma.ProjectPhaseDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.projectMilestone`: Exposes CRUD operations for the **ProjectMilestone** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectMilestones
   * const projectMilestones = await prisma.projectMilestone.findMany()
   * ```
   */
  get projectMilestone(): Prisma.ProjectMilestoneDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.projectTask`: Exposes CRUD operations for the **ProjectTask** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectTasks
   * const projectTasks = await prisma.projectTask.findMany()
   * ```
   */
  get projectTask(): Prisma.ProjectTaskDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.projectRisk`: Exposes CRUD operations for the **ProjectRisk** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectRisks
   * const projectRisks = await prisma.projectRisk.findMany()
   * ```
   */
  get projectRisk(): Prisma.ProjectRiskDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.projectMember`: Exposes CRUD operations for the **ProjectMember** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectMembers
   * const projectMembers = await prisma.projectMember.findMany()
   * ```
   */
  get projectMember(): Prisma.ProjectMemberDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.projectStatusLog`: Exposes CRUD operations for the **ProjectStatusLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProjectStatusLogs
   * const projectStatusLogs = await prisma.projectStatusLog.findMany()
   * ```
   */
  get projectStatusLog(): Prisma.ProjectStatusLogDelegate<ExtArgs, ClientOptions>
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P]
  }

  export type Enumerable<T> = T | Array<T>

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  }

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I
  ) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K]
  } & {}

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>
      }
    >
  >

  type Key = string | number | symbol
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never
  type AtStrict<O extends object, K extends Key> = O[K & keyof O]
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>
    0: AtLoose<O, K>
  }[strict]

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K]
      } & {}

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K]
  } & {}

  type _Record<K extends keyof any, T> = {
    [P in K]: T
  }

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B

  export const type: unique symbol

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never
      }
    : never

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>

  export const ModelName: {
    ProjectState: 'ProjectState'
    TaskState: 'TaskState'
    AcceptanceState: 'AcceptanceState'
    SettlementState: 'SettlementState'
    AuditLog: 'AuditLog'
    IdempotencyKey: 'IdempotencyKey'
    Project: 'Project'
    ProjectPhase: 'ProjectPhase'
    ProjectMilestone: 'ProjectMilestone'
    ProjectTask: 'ProjectTask'
    ProjectRisk: 'ProjectRisk'
    ProjectMember: 'ProjectMember'
    ProjectStatusLog: 'ProjectStatusLog'
  }

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps:
        | 'projectState'
        | 'taskState'
        | 'acceptanceState'
        | 'settlementState'
        | 'auditLog'
        | 'idempotencyKey'
        | 'project'
        | 'projectPhase'
        | 'projectMilestone'
        | 'projectTask'
        | 'projectRisk'
        | 'projectMember'
        | 'projectStatusLog'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ProjectState: {
        payload: Prisma.$ProjectStatePayload<ExtArgs>
        fields: Prisma.ProjectStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>
          }
          findFirst: {
            args: Prisma.ProjectStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>
          }
          findMany: {
            args: Prisma.ProjectStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>[]
          }
          create: {
            args: Prisma.ProjectStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>
          }
          createMany: {
            args: Prisma.ProjectStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>[]
          }
          delete: {
            args: Prisma.ProjectStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>
          }
          update: {
            args: Prisma.ProjectStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>
          }
          deleteMany: {
            args: Prisma.ProjectStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>[]
          }
          upsert: {
            args: Prisma.ProjectStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatePayload>
          }
          aggregate: {
            args: Prisma.ProjectStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectState>
          }
          groupBy: {
            args: Prisma.ProjectStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectStateCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectStateCountAggregateOutputType> | number
          }
        }
      }
      TaskState: {
        payload: Prisma.$TaskStatePayload<ExtArgs>
        fields: Prisma.TaskStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>
          }
          findFirst: {
            args: Prisma.TaskStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>
          }
          findMany: {
            args: Prisma.TaskStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>[]
          }
          create: {
            args: Prisma.TaskStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>
          }
          createMany: {
            args: Prisma.TaskStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>[]
          }
          delete: {
            args: Prisma.TaskStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>
          }
          update: {
            args: Prisma.TaskStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>
          }
          deleteMany: {
            args: Prisma.TaskStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>[]
          }
          upsert: {
            args: Prisma.TaskStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskStatePayload>
          }
          aggregate: {
            args: Prisma.TaskStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskState>
          }
          groupBy: {
            args: Prisma.TaskStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskStateCountArgs<ExtArgs>
            result: $Utils.Optional<TaskStateCountAggregateOutputType> | number
          }
        }
      }
      AcceptanceState: {
        payload: Prisma.$AcceptanceStatePayload<ExtArgs>
        fields: Prisma.AcceptanceStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AcceptanceStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AcceptanceStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>
          }
          findFirst: {
            args: Prisma.AcceptanceStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AcceptanceStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>
          }
          findMany: {
            args: Prisma.AcceptanceStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>[]
          }
          create: {
            args: Prisma.AcceptanceStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>
          }
          createMany: {
            args: Prisma.AcceptanceStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AcceptanceStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>[]
          }
          delete: {
            args: Prisma.AcceptanceStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>
          }
          update: {
            args: Prisma.AcceptanceStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>
          }
          deleteMany: {
            args: Prisma.AcceptanceStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AcceptanceStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AcceptanceStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>[]
          }
          upsert: {
            args: Prisma.AcceptanceStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcceptanceStatePayload>
          }
          aggregate: {
            args: Prisma.AcceptanceStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAcceptanceState>
          }
          groupBy: {
            args: Prisma.AcceptanceStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<AcceptanceStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.AcceptanceStateCountArgs<ExtArgs>
            result: $Utils.Optional<AcceptanceStateCountAggregateOutputType> | number
          }
        }
      }
      SettlementState: {
        payload: Prisma.$SettlementStatePayload<ExtArgs>
        fields: Prisma.SettlementStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettlementStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettlementStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>
          }
          findFirst: {
            args: Prisma.SettlementStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettlementStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>
          }
          findMany: {
            args: Prisma.SettlementStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>[]
          }
          create: {
            args: Prisma.SettlementStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>
          }
          createMany: {
            args: Prisma.SettlementStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettlementStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>[]
          }
          delete: {
            args: Prisma.SettlementStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>
          }
          update: {
            args: Prisma.SettlementStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>
          }
          deleteMany: {
            args: Prisma.SettlementStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettlementStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettlementStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>[]
          }
          upsert: {
            args: Prisma.SettlementStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettlementStatePayload>
          }
          aggregate: {
            args: Prisma.SettlementStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettlementState>
          }
          groupBy: {
            args: Prisma.SettlementStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettlementStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettlementStateCountArgs<ExtArgs>
            result: $Utils.Optional<SettlementStateCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      IdempotencyKey: {
        payload: Prisma.$IdempotencyKeyPayload<ExtArgs>
        fields: Prisma.IdempotencyKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdempotencyKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          findFirst: {
            args: Prisma.IdempotencyKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdempotencyKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          findMany: {
            args: Prisma.IdempotencyKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[]
          }
          create: {
            args: Prisma.IdempotencyKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          createMany: {
            args: Prisma.IdempotencyKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdempotencyKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[]
          }
          delete: {
            args: Prisma.IdempotencyKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          update: {
            args: Prisma.IdempotencyKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          deleteMany: {
            args: Prisma.IdempotencyKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdempotencyKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[]
          }
          upsert: {
            args: Prisma.IdempotencyKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          aggregate: {
            args: Prisma.IdempotencyKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdempotencyKey>
          }
          groupBy: {
            args: Prisma.IdempotencyKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdempotencyKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdempotencyKeyCountArgs<ExtArgs>
            result: $Utils.Optional<IdempotencyKeyCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectPhase: {
        payload: Prisma.$ProjectPhasePayload<ExtArgs>
        fields: Prisma.ProjectPhaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectPhaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectPhaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>
          }
          findFirst: {
            args: Prisma.ProjectPhaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectPhaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>
          }
          findMany: {
            args: Prisma.ProjectPhaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>[]
          }
          create: {
            args: Prisma.ProjectPhaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>
          }
          createMany: {
            args: Prisma.ProjectPhaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectPhaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>[]
          }
          delete: {
            args: Prisma.ProjectPhaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>
          }
          update: {
            args: Prisma.ProjectPhaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>
          }
          deleteMany: {
            args: Prisma.ProjectPhaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectPhaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectPhaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>[]
          }
          upsert: {
            args: Prisma.ProjectPhaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPhasePayload>
          }
          aggregate: {
            args: Prisma.ProjectPhaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectPhase>
          }
          groupBy: {
            args: Prisma.ProjectPhaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectPhaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectPhaseCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectPhaseCountAggregateOutputType> | number
          }
        }
      }
      ProjectMilestone: {
        payload: Prisma.$ProjectMilestonePayload<ExtArgs>
        fields: Prisma.ProjectMilestoneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectMilestoneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectMilestoneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>
          }
          findFirst: {
            args: Prisma.ProjectMilestoneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectMilestoneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>
          }
          findMany: {
            args: Prisma.ProjectMilestoneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>[]
          }
          create: {
            args: Prisma.ProjectMilestoneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>
          }
          createMany: {
            args: Prisma.ProjectMilestoneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectMilestoneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>[]
          }
          delete: {
            args: Prisma.ProjectMilestoneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>
          }
          update: {
            args: Prisma.ProjectMilestoneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>
          }
          deleteMany: {
            args: Prisma.ProjectMilestoneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectMilestoneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectMilestoneUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>[]
          }
          upsert: {
            args: Prisma.ProjectMilestoneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMilestonePayload>
          }
          aggregate: {
            args: Prisma.ProjectMilestoneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectMilestone>
          }
          groupBy: {
            args: Prisma.ProjectMilestoneGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectMilestoneGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectMilestoneCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectMilestoneCountAggregateOutputType> | number
          }
        }
      }
      ProjectTask: {
        payload: Prisma.$ProjectTaskPayload<ExtArgs>
        fields: Prisma.ProjectTaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectTaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectTaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          findFirst: {
            args: Prisma.ProjectTaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectTaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          findMany: {
            args: Prisma.ProjectTaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>[]
          }
          create: {
            args: Prisma.ProjectTaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          createMany: {
            args: Prisma.ProjectTaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectTaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>[]
          }
          delete: {
            args: Prisma.ProjectTaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          update: {
            args: Prisma.ProjectTaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          deleteMany: {
            args: Prisma.ProjectTaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectTaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectTaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>[]
          }
          upsert: {
            args: Prisma.ProjectTaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          aggregate: {
            args: Prisma.ProjectTaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectTask>
          }
          groupBy: {
            args: Prisma.ProjectTaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectTaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectTaskCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectTaskCountAggregateOutputType> | number
          }
        }
      }
      ProjectRisk: {
        payload: Prisma.$ProjectRiskPayload<ExtArgs>
        fields: Prisma.ProjectRiskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectRiskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectRiskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>
          }
          findFirst: {
            args: Prisma.ProjectRiskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectRiskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>
          }
          findMany: {
            args: Prisma.ProjectRiskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>[]
          }
          create: {
            args: Prisma.ProjectRiskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>
          }
          createMany: {
            args: Prisma.ProjectRiskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectRiskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>[]
          }
          delete: {
            args: Prisma.ProjectRiskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>
          }
          update: {
            args: Prisma.ProjectRiskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>
          }
          deleteMany: {
            args: Prisma.ProjectRiskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectRiskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectRiskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>[]
          }
          upsert: {
            args: Prisma.ProjectRiskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectRiskPayload>
          }
          aggregate: {
            args: Prisma.ProjectRiskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectRisk>
          }
          groupBy: {
            args: Prisma.ProjectRiskGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectRiskGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectRiskCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectRiskCountAggregateOutputType> | number
          }
        }
      }
      ProjectMember: {
        payload: Prisma.$ProjectMemberPayload<ExtArgs>
        fields: Prisma.ProjectMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          findFirst: {
            args: Prisma.ProjectMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          findMany: {
            args: Prisma.ProjectMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          create: {
            args: Prisma.ProjectMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          createMany: {
            args: Prisma.ProjectMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          delete: {
            args: Prisma.ProjectMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          update: {
            args: Prisma.ProjectMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          deleteMany: {
            args: Prisma.ProjectMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          upsert: {
            args: Prisma.ProjectMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          aggregate: {
            args: Prisma.ProjectMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectMember>
          }
          groupBy: {
            args: Prisma.ProjectMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectMemberCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectMemberCountAggregateOutputType> | number
          }
        }
      }
      ProjectStatusLog: {
        payload: Prisma.$ProjectStatusLogPayload<ExtArgs>
        fields: Prisma.ProjectStatusLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectStatusLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectStatusLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>
          }
          findFirst: {
            args: Prisma.ProjectStatusLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectStatusLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>
          }
          findMany: {
            args: Prisma.ProjectStatusLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>[]
          }
          create: {
            args: Prisma.ProjectStatusLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>
          }
          createMany: {
            args: Prisma.ProjectStatusLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectStatusLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>[]
          }
          delete: {
            args: Prisma.ProjectStatusLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>
          }
          update: {
            args: Prisma.ProjectStatusLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>
          }
          deleteMany: {
            args: Prisma.ProjectStatusLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectStatusLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectStatusLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>[]
          }
          upsert: {
            args: Prisma.ProjectStatusLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectStatusLogPayload>
          }
          aggregate: {
            args: Prisma.ProjectStatusLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectStatusLog>
          }
          groupBy: {
            args: Prisma.ProjectStatusLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectStatusLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectStatusLogCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectStatusLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    projectState?: ProjectStateOmit
    taskState?: TaskStateOmit
    acceptanceState?: AcceptanceStateOmit
    settlementState?: SettlementStateOmit
    auditLog?: AuditLogOmit
    idempotencyKey?: IdempotencyKeyOmit
    project?: ProjectOmit
    projectPhase?: ProjectPhaseOmit
    projectMilestone?: ProjectMilestoneOmit
    projectTask?: ProjectTaskOmit
    projectRisk?: ProjectRiskOmit
    projectMember?: ProjectMemberOmit
    projectStatusLog?: ProjectStatusLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */

  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    phases: number
    milestones: number
    taskTree: number
    risks: number
    members: number
    statusLogs: number
  }

  export type ProjectCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    phases?: boolean | ProjectCountOutputTypeCountPhasesArgs
    milestones?: boolean | ProjectCountOutputTypeCountMilestonesArgs
    taskTree?: boolean | ProjectCountOutputTypeCountTaskTreeArgs
    risks?: boolean | ProjectCountOutputTypeCountRisksArgs
    members?: boolean | ProjectCountOutputTypeCountMembersArgs
    statusLogs?: boolean | ProjectCountOutputTypeCountStatusLogsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountPhasesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectPhaseWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMilestonesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectMilestoneWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTaskTreeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectTaskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountRisksArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectRiskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMembersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectMemberWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountStatusLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectStatusLogWhereInput
  }

  /**
   * Models
   */

  /**
   * Model ProjectState
   */

  export type AggregateProjectState = {
    _count: ProjectStateCountAggregateOutputType | null
    _avg: ProjectStateAvgAggregateOutputType | null
    _sum: ProjectStateSumAggregateOutputType | null
    _min: ProjectStateMinAggregateOutputType | null
    _max: ProjectStateMaxAggregateOutputType | null
  }

  export type ProjectStateAvgAggregateOutputType = {
    id: number | null
  }

  export type ProjectStateSumAggregateOutputType = {
    id: number | null
  }

  export type ProjectStateMinAggregateOutputType = {
    id: number | null
    envId: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type ProjectStateMaxAggregateOutputType = {
    id: number | null
    envId: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type ProjectStateCountAggregateOutputType = {
    id: number
    envId: number
    snapshotJson: number
    updatedAt: number
    _all: number
  }

  export type ProjectStateAvgAggregateInputType = {
    id?: true
  }

  export type ProjectStateSumAggregateInputType = {
    id?: true
  }

  export type ProjectStateMinAggregateInputType = {
    id?: true
    envId?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type ProjectStateMaxAggregateInputType = {
    id?: true
    envId?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type ProjectStateCountAggregateInputType = {
    id?: true
    envId?: true
    snapshotJson?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectStateAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectState to aggregate.
     */
    where?: ProjectStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStates to fetch.
     */
    orderBy?: ProjectStateOrderByWithRelationInput | ProjectStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectStates
     **/
    _count?: true | ProjectStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectStateMaxAggregateInputType
  }

  export type GetProjectStateAggregateType<T extends ProjectStateAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectState[P]>
      : GetScalarType<T[P], AggregateProjectState[P]>
  }

  export type ProjectStateGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectStateWhereInput
    orderBy?: ProjectStateOrderByWithAggregationInput | ProjectStateOrderByWithAggregationInput[]
    by: ProjectStateScalarFieldEnum[] | ProjectStateScalarFieldEnum
    having?: ProjectStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectStateCountAggregateInputType | true
    _avg?: ProjectStateAvgAggregateInputType
    _sum?: ProjectStateSumAggregateInputType
    _min?: ProjectStateMinAggregateInputType
    _max?: ProjectStateMaxAggregateInputType
  }

  export type ProjectStateGroupByOutputType = {
    id: number
    envId: string
    snapshotJson: string
    updatedAt: Date
    _count: ProjectStateCountAggregateOutputType | null
    _avg: ProjectStateAvgAggregateOutputType | null
    _sum: ProjectStateSumAggregateOutputType | null
    _min: ProjectStateMinAggregateOutputType | null
    _max: ProjectStateMaxAggregateOutputType | null
  }

  type GetProjectStateGroupByPayload<T extends ProjectStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectStateGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProjectStateGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProjectStateGroupByOutputType[P]>
          : GetScalarType<T[P], ProjectStateGroupByOutputType[P]>
      }
    >
  >

  export type ProjectStateSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['projectState']
  >

  export type ProjectStateSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['projectState']
  >

  export type ProjectStateSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['projectState']
  >

  export type ProjectStateSelectScalar = {
    id?: boolean
    envId?: boolean
    snapshotJson?: boolean
    updatedAt?: boolean
  }

  export type ProjectStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'envId' | 'snapshotJson' | 'updatedAt',
      ExtArgs['result']['projectState']
    >

  export type $ProjectStatePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectState'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        envId: string
        snapshotJson: string
        updatedAt: Date
      },
      ExtArgs['result']['projectState']
    >
    composites: {}
  }

  type ProjectStateGetPayload<S extends boolean | null | undefined | ProjectStateDefaultArgs> =
    $Result.GetResult<Prisma.$ProjectStatePayload, S>

  type ProjectStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectStateCountAggregateInputType | true
    }

  export interface ProjectStateDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectState']
      meta: { name: 'ProjectState' }
    }
    /**
     * Find zero or one ProjectState that matches the filter.
     * @param {ProjectStateFindUniqueArgs} args - Arguments to find a ProjectState
     * @example
     * // Get one ProjectState
     * const projectState = await prisma.projectState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectStateFindUniqueArgs>(
      args: SelectSubset<T, ProjectStateFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<
        Prisma.$ProjectStatePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectStateFindUniqueOrThrowArgs} args - Arguments to find a ProjectState
     * @example
     * // Get one ProjectState
     * const projectState = await prisma.projectState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectStateFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectStateFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<
        Prisma.$ProjectStatePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateFindFirstArgs} args - Arguments to find a ProjectState
     * @example
     * // Get one ProjectState
     * const projectState = await prisma.projectState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectStateFindFirstArgs>(
      args?: SelectSubset<T, ProjectStateFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<
        Prisma.$ProjectStatePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateFindFirstOrThrowArgs} args - Arguments to find a ProjectState
     * @example
     * // Get one ProjectState
     * const projectState = await prisma.projectState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectStateFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectStateFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<
        Prisma.$ProjectStatePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectStates
     * const projectStates = await prisma.projectState.findMany()
     *
     * // Get first 10 ProjectStates
     * const projectStates = await prisma.projectState.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectStateWithIdOnly = await prisma.projectState.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectStateFindManyArgs>(
      args?: SelectSubset<T, ProjectStateFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectStatePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectState.
     * @param {ProjectStateCreateArgs} args - Arguments to create a ProjectState.
     * @example
     * // Create one ProjectState
     * const ProjectState = await prisma.projectState.create({
     *   data: {
     *     // ... data to create a ProjectState
     *   }
     * })
     *
     */
    create<T extends ProjectStateCreateArgs>(
      args: SelectSubset<T, ProjectStateCreateArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<Prisma.$ProjectStatePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectStates.
     * @param {ProjectStateCreateManyArgs} args - Arguments to create many ProjectStates.
     * @example
     * // Create many ProjectStates
     * const projectState = await prisma.projectState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectStateCreateManyArgs>(
      args?: SelectSubset<T, ProjectStateCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectStates and returns the data saved in the database.
     * @param {ProjectStateCreateManyAndReturnArgs} args - Arguments to create many ProjectStates.
     * @example
     * // Create many ProjectStates
     * const projectState = await prisma.projectState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectStates and only return the `id`
     * const projectStateWithIdOnly = await prisma.projectState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectStateCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectStateCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectStatePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectState.
     * @param {ProjectStateDeleteArgs} args - Arguments to delete one ProjectState.
     * @example
     * // Delete one ProjectState
     * const ProjectState = await prisma.projectState.delete({
     *   where: {
     *     // ... filter to delete one ProjectState
     *   }
     * })
     *
     */
    delete<T extends ProjectStateDeleteArgs>(
      args: SelectSubset<T, ProjectStateDeleteArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<Prisma.$ProjectStatePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectState.
     * @param {ProjectStateUpdateArgs} args - Arguments to update one ProjectState.
     * @example
     * // Update one ProjectState
     * const projectState = await prisma.projectState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectStateUpdateArgs>(
      args: SelectSubset<T, ProjectStateUpdateArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<Prisma.$ProjectStatePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectStates.
     * @param {ProjectStateDeleteManyArgs} args - Arguments to filter ProjectStates to delete.
     * @example
     * // Delete a few ProjectStates
     * const { count } = await prisma.projectState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectStateDeleteManyArgs>(
      args?: SelectSubset<T, ProjectStateDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectStates
     * const projectState = await prisma.projectState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectStateUpdateManyArgs>(
      args: SelectSubset<T, ProjectStateUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectStates and returns the data updated in the database.
     * @param {ProjectStateUpdateManyAndReturnArgs} args - Arguments to update many ProjectStates.
     * @example
     * // Update many ProjectStates
     * const projectState = await prisma.projectState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectStates and only return the `id`
     * const projectStateWithIdOnly = await prisma.projectState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectStateUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectStateUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectStatePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectState.
     * @param {ProjectStateUpsertArgs} args - Arguments to update or create a ProjectState.
     * @example
     * // Update or create a ProjectState
     * const projectState = await prisma.projectState.upsert({
     *   create: {
     *     // ... data to create a ProjectState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectState we want to update
     *   }
     * })
     */
    upsert<T extends ProjectStateUpsertArgs>(
      args: SelectSubset<T, ProjectStateUpsertArgs<ExtArgs>>
    ): Prisma__ProjectStateClient<
      $Result.GetResult<Prisma.$ProjectStatePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateCountArgs} args - Arguments to filter ProjectStates to count.
     * @example
     * // Count the number of ProjectStates
     * const count = await prisma.projectState.count({
     *   where: {
     *     // ... the filter for the ProjectStates we want to count
     *   }
     * })
     **/
    count<T extends ProjectStateCountArgs>(
      args?: Subset<T, ProjectStateCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectStateAggregateArgs>(
      args: Subset<T, ProjectStateAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectStateAggregateType<T>>

    /**
     * Group by ProjectState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectStateGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectStateGroupByArgs['orderBy'] }
        : { orderBy?: ProjectStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectStateGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProjectStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectState model
     */
    readonly fields: ProjectStateFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectStateClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectState model
   */
  interface ProjectStateFieldRefs {
    readonly id: FieldRef<'ProjectState', 'Int'>
    readonly envId: FieldRef<'ProjectState', 'String'>
    readonly snapshotJson: FieldRef<'ProjectState', 'String'>
    readonly updatedAt: FieldRef<'ProjectState', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * ProjectState findUnique
   */
  export type ProjectStateFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * Filter, which ProjectState to fetch.
     */
    where: ProjectStateWhereUniqueInput
  }

  /**
   * ProjectState findUniqueOrThrow
   */
  export type ProjectStateFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * Filter, which ProjectState to fetch.
     */
    where: ProjectStateWhereUniqueInput
  }

  /**
   * ProjectState findFirst
   */
  export type ProjectStateFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * Filter, which ProjectState to fetch.
     */
    where?: ProjectStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStates to fetch.
     */
    orderBy?: ProjectStateOrderByWithRelationInput | ProjectStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectStates.
     */
    cursor?: ProjectStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectStates.
     */
    distinct?: ProjectStateScalarFieldEnum | ProjectStateScalarFieldEnum[]
  }

  /**
   * ProjectState findFirstOrThrow
   */
  export type ProjectStateFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * Filter, which ProjectState to fetch.
     */
    where?: ProjectStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStates to fetch.
     */
    orderBy?: ProjectStateOrderByWithRelationInput | ProjectStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectStates.
     */
    cursor?: ProjectStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectStates.
     */
    distinct?: ProjectStateScalarFieldEnum | ProjectStateScalarFieldEnum[]
  }

  /**
   * ProjectState findMany
   */
  export type ProjectStateFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * Filter, which ProjectStates to fetch.
     */
    where?: ProjectStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStates to fetch.
     */
    orderBy?: ProjectStateOrderByWithRelationInput | ProjectStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectStates.
     */
    cursor?: ProjectStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectStates.
     */
    distinct?: ProjectStateScalarFieldEnum | ProjectStateScalarFieldEnum[]
  }

  /**
   * ProjectState create
   */
  export type ProjectStateCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * The data needed to create a ProjectState.
     */
    data: XOR<ProjectStateCreateInput, ProjectStateUncheckedCreateInput>
  }

  /**
   * ProjectState createMany
   */
  export type ProjectStateCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectStates.
     */
    data: ProjectStateCreateManyInput | ProjectStateCreateManyInput[]
  }

  /**
   * ProjectState createManyAndReturn
   */
  export type ProjectStateCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectStates.
     */
    data: ProjectStateCreateManyInput | ProjectStateCreateManyInput[]
  }

  /**
   * ProjectState update
   */
  export type ProjectStateUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * The data needed to update a ProjectState.
     */
    data: XOR<ProjectStateUpdateInput, ProjectStateUncheckedUpdateInput>
    /**
     * Choose, which ProjectState to update.
     */
    where: ProjectStateWhereUniqueInput
  }

  /**
   * ProjectState updateMany
   */
  export type ProjectStateUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectStates.
     */
    data: XOR<ProjectStateUpdateManyMutationInput, ProjectStateUncheckedUpdateManyInput>
    /**
     * Filter which ProjectStates to update
     */
    where?: ProjectStateWhereInput
    /**
     * Limit how many ProjectStates to update.
     */
    limit?: number
  }

  /**
   * ProjectState updateManyAndReturn
   */
  export type ProjectStateUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * The data used to update ProjectStates.
     */
    data: XOR<ProjectStateUpdateManyMutationInput, ProjectStateUncheckedUpdateManyInput>
    /**
     * Filter which ProjectStates to update
     */
    where?: ProjectStateWhereInput
    /**
     * Limit how many ProjectStates to update.
     */
    limit?: number
  }

  /**
   * ProjectState upsert
   */
  export type ProjectStateUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * The filter to search for the ProjectState to update in case it exists.
     */
    where: ProjectStateWhereUniqueInput
    /**
     * In case the ProjectState found by the `where` argument doesn't exist, create a new ProjectState with this data.
     */
    create: XOR<ProjectStateCreateInput, ProjectStateUncheckedCreateInput>
    /**
     * In case the ProjectState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectStateUpdateInput, ProjectStateUncheckedUpdateInput>
  }

  /**
   * ProjectState delete
   */
  export type ProjectStateDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
    /**
     * Filter which ProjectState to delete.
     */
    where: ProjectStateWhereUniqueInput
  }

  /**
   * ProjectState deleteMany
   */
  export type ProjectStateDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectStates to delete
     */
    where?: ProjectStateWhereInput
    /**
     * Limit how many ProjectStates to delete.
     */
    limit?: number
  }

  /**
   * ProjectState without action
   */
  export type ProjectStateDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectState
     */
    select?: ProjectStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectState
     */
    omit?: ProjectStateOmit<ExtArgs> | null
  }

  /**
   * Model TaskState
   */

  export type AggregateTaskState = {
    _count: TaskStateCountAggregateOutputType | null
    _avg: TaskStateAvgAggregateOutputType | null
    _sum: TaskStateSumAggregateOutputType | null
    _min: TaskStateMinAggregateOutputType | null
    _max: TaskStateMaxAggregateOutputType | null
  }

  export type TaskStateAvgAggregateOutputType = {
    id: number | null
  }

  export type TaskStateSumAggregateOutputType = {
    id: number | null
  }

  export type TaskStateMinAggregateOutputType = {
    id: number | null
    envId: string | null
    contextKey: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type TaskStateMaxAggregateOutputType = {
    id: number | null
    envId: string | null
    contextKey: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type TaskStateCountAggregateOutputType = {
    id: number
    envId: number
    contextKey: number
    snapshotJson: number
    updatedAt: number
    _all: number
  }

  export type TaskStateAvgAggregateInputType = {
    id?: true
  }

  export type TaskStateSumAggregateInputType = {
    id?: true
  }

  export type TaskStateMinAggregateInputType = {
    id?: true
    envId?: true
    contextKey?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type TaskStateMaxAggregateInputType = {
    id?: true
    envId?: true
    contextKey?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type TaskStateCountAggregateInputType = {
    id?: true
    envId?: true
    contextKey?: true
    snapshotJson?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskStateAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which TaskState to aggregate.
     */
    where?: TaskStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TaskStates to fetch.
     */
    orderBy?: TaskStateOrderByWithRelationInput | TaskStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TaskStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TaskStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TaskStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TaskStates
     **/
    _count?: true | TaskStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TaskStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TaskStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TaskStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TaskStateMaxAggregateInputType
  }

  export type GetTaskStateAggregateType<T extends TaskStateAggregateArgs> = {
    [P in keyof T & keyof AggregateTaskState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskState[P]>
      : GetScalarType<T[P], AggregateTaskState[P]>
  }

  export type TaskStateGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TaskStateWhereInput
    orderBy?: TaskStateOrderByWithAggregationInput | TaskStateOrderByWithAggregationInput[]
    by: TaskStateScalarFieldEnum[] | TaskStateScalarFieldEnum
    having?: TaskStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskStateCountAggregateInputType | true
    _avg?: TaskStateAvgAggregateInputType
    _sum?: TaskStateSumAggregateInputType
    _min?: TaskStateMinAggregateInputType
    _max?: TaskStateMaxAggregateInputType
  }

  export type TaskStateGroupByOutputType = {
    id: number
    envId: string
    contextKey: string
    snapshotJson: string
    updatedAt: Date
    _count: TaskStateCountAggregateOutputType | null
    _avg: TaskStateAvgAggregateOutputType | null
    _sum: TaskStateSumAggregateOutputType | null
    _min: TaskStateMinAggregateOutputType | null
    _max: TaskStateMaxAggregateOutputType | null
  }

  type GetTaskStateGroupByPayload<T extends TaskStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskStateGroupByOutputType, T['by']> & {
        [P in keyof T & keyof TaskStateGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TaskStateGroupByOutputType[P]>
          : GetScalarType<T[P], TaskStateGroupByOutputType[P]>
      }
    >
  >

  export type TaskStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        envId?: boolean
        contextKey?: boolean
        snapshotJson?: boolean
        updatedAt?: boolean
      },
      ExtArgs['result']['taskState']
    >

  export type TaskStateSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      contextKey?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['taskState']
  >

  export type TaskStateSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      contextKey?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['taskState']
  >

  export type TaskStateSelectScalar = {
    id?: boolean
    envId?: boolean
    contextKey?: boolean
    snapshotJson?: boolean
    updatedAt?: boolean
  }

  export type TaskStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'envId' | 'contextKey' | 'snapshotJson' | 'updatedAt',
      ExtArgs['result']['taskState']
    >

  export type $TaskStatePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'TaskState'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        envId: string
        contextKey: string
        snapshotJson: string
        updatedAt: Date
      },
      ExtArgs['result']['taskState']
    >
    composites: {}
  }

  type TaskStateGetPayload<S extends boolean | null | undefined | TaskStateDefaultArgs> =
    $Result.GetResult<Prisma.$TaskStatePayload, S>

  type TaskStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskStateCountAggregateInputType | true
    }

  export interface TaskStateDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['TaskState']
      meta: { name: 'TaskState' }
    }
    /**
     * Find zero or one TaskState that matches the filter.
     * @param {TaskStateFindUniqueArgs} args - Arguments to find a TaskState
     * @example
     * // Get one TaskState
     * const taskState = await prisma.taskState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskStateFindUniqueArgs>(
      args: SelectSubset<T, TaskStateFindUniqueArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<
        Prisma.$TaskStatePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one TaskState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskStateFindUniqueOrThrowArgs} args - Arguments to find a TaskState
     * @example
     * // Get one TaskState
     * const taskState = await prisma.taskState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskStateFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TaskStateFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<
        Prisma.$TaskStatePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first TaskState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateFindFirstArgs} args - Arguments to find a TaskState
     * @example
     * // Get one TaskState
     * const taskState = await prisma.taskState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskStateFindFirstArgs>(
      args?: SelectSubset<T, TaskStateFindFirstArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<
        Prisma.$TaskStatePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first TaskState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateFindFirstOrThrowArgs} args - Arguments to find a TaskState
     * @example
     * // Get one TaskState
     * const taskState = await prisma.taskState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskStateFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TaskStateFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<
        Prisma.$TaskStatePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more TaskStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskStates
     * const taskStates = await prisma.taskState.findMany()
     *
     * // Get first 10 TaskStates
     * const taskStates = await prisma.taskState.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const taskStateWithIdOnly = await prisma.taskState.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TaskStateFindManyArgs>(
      args?: SelectSubset<T, TaskStateFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TaskStatePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a TaskState.
     * @param {TaskStateCreateArgs} args - Arguments to create a TaskState.
     * @example
     * // Create one TaskState
     * const TaskState = await prisma.taskState.create({
     *   data: {
     *     // ... data to create a TaskState
     *   }
     * })
     *
     */
    create<T extends TaskStateCreateArgs>(
      args: SelectSubset<T, TaskStateCreateArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<Prisma.$TaskStatePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many TaskStates.
     * @param {TaskStateCreateManyArgs} args - Arguments to create many TaskStates.
     * @example
     * // Create many TaskStates
     * const taskState = await prisma.taskState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TaskStateCreateManyArgs>(
      args?: SelectSubset<T, TaskStateCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskStates and returns the data saved in the database.
     * @param {TaskStateCreateManyAndReturnArgs} args - Arguments to create many TaskStates.
     * @example
     * // Create many TaskStates
     * const taskState = await prisma.taskState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many TaskStates and only return the `id`
     * const taskStateWithIdOnly = await prisma.taskState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TaskStateCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TaskStateCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TaskStatePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a TaskState.
     * @param {TaskStateDeleteArgs} args - Arguments to delete one TaskState.
     * @example
     * // Delete one TaskState
     * const TaskState = await prisma.taskState.delete({
     *   where: {
     *     // ... filter to delete one TaskState
     *   }
     * })
     *
     */
    delete<T extends TaskStateDeleteArgs>(
      args: SelectSubset<T, TaskStateDeleteArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<Prisma.$TaskStatePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one TaskState.
     * @param {TaskStateUpdateArgs} args - Arguments to update one TaskState.
     * @example
     * // Update one TaskState
     * const taskState = await prisma.taskState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TaskStateUpdateArgs>(
      args: SelectSubset<T, TaskStateUpdateArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<Prisma.$TaskStatePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more TaskStates.
     * @param {TaskStateDeleteManyArgs} args - Arguments to filter TaskStates to delete.
     * @example
     * // Delete a few TaskStates
     * const { count } = await prisma.taskState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TaskStateDeleteManyArgs>(
      args?: SelectSubset<T, TaskStateDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskStates
     * const taskState = await prisma.taskState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TaskStateUpdateManyArgs>(
      args: SelectSubset<T, TaskStateUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskStates and returns the data updated in the database.
     * @param {TaskStateUpdateManyAndReturnArgs} args - Arguments to update many TaskStates.
     * @example
     * // Update many TaskStates
     * const taskState = await prisma.taskState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more TaskStates and only return the `id`
     * const taskStateWithIdOnly = await prisma.taskState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TaskStateUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TaskStateUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TaskStatePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one TaskState.
     * @param {TaskStateUpsertArgs} args - Arguments to update or create a TaskState.
     * @example
     * // Update or create a TaskState
     * const taskState = await prisma.taskState.upsert({
     *   create: {
     *     // ... data to create a TaskState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskState we want to update
     *   }
     * })
     */
    upsert<T extends TaskStateUpsertArgs>(
      args: SelectSubset<T, TaskStateUpsertArgs<ExtArgs>>
    ): Prisma__TaskStateClient<
      $Result.GetResult<Prisma.$TaskStatePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of TaskStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateCountArgs} args - Arguments to filter TaskStates to count.
     * @example
     * // Count the number of TaskStates
     * const count = await prisma.taskState.count({
     *   where: {
     *     // ... the filter for the TaskStates we want to count
     *   }
     * })
     **/
    count<T extends TaskStateCountArgs>(
      args?: Subset<T, TaskStateCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TaskStateAggregateArgs>(
      args: Subset<T, TaskStateAggregateArgs>
    ): Prisma.PrismaPromise<GetTaskStateAggregateType<T>>

    /**
     * Group by TaskState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TaskStateGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskStateGroupByArgs['orderBy'] }
        : { orderBy?: TaskStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TaskStateGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetTaskStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the TaskState model
     */
    readonly fields: TaskStateFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskStateClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the TaskState model
   */
  interface TaskStateFieldRefs {
    readonly id: FieldRef<'TaskState', 'Int'>
    readonly envId: FieldRef<'TaskState', 'String'>
    readonly contextKey: FieldRef<'TaskState', 'String'>
    readonly snapshotJson: FieldRef<'TaskState', 'String'>
    readonly updatedAt: FieldRef<'TaskState', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * TaskState findUnique
   */
  export type TaskStateFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * Filter, which TaskState to fetch.
     */
    where: TaskStateWhereUniqueInput
  }

  /**
   * TaskState findUniqueOrThrow
   */
  export type TaskStateFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * Filter, which TaskState to fetch.
     */
    where: TaskStateWhereUniqueInput
  }

  /**
   * TaskState findFirst
   */
  export type TaskStateFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * Filter, which TaskState to fetch.
     */
    where?: TaskStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TaskStates to fetch.
     */
    orderBy?: TaskStateOrderByWithRelationInput | TaskStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TaskStates.
     */
    cursor?: TaskStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TaskStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TaskStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TaskStates.
     */
    distinct?: TaskStateScalarFieldEnum | TaskStateScalarFieldEnum[]
  }

  /**
   * TaskState findFirstOrThrow
   */
  export type TaskStateFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * Filter, which TaskState to fetch.
     */
    where?: TaskStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TaskStates to fetch.
     */
    orderBy?: TaskStateOrderByWithRelationInput | TaskStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TaskStates.
     */
    cursor?: TaskStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TaskStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TaskStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TaskStates.
     */
    distinct?: TaskStateScalarFieldEnum | TaskStateScalarFieldEnum[]
  }

  /**
   * TaskState findMany
   */
  export type TaskStateFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * Filter, which TaskStates to fetch.
     */
    where?: TaskStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TaskStates to fetch.
     */
    orderBy?: TaskStateOrderByWithRelationInput | TaskStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TaskStates.
     */
    cursor?: TaskStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TaskStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TaskStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TaskStates.
     */
    distinct?: TaskStateScalarFieldEnum | TaskStateScalarFieldEnum[]
  }

  /**
   * TaskState create
   */
  export type TaskStateCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * The data needed to create a TaskState.
     */
    data: XOR<TaskStateCreateInput, TaskStateUncheckedCreateInput>
  }

  /**
   * TaskState createMany
   */
  export type TaskStateCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many TaskStates.
     */
    data: TaskStateCreateManyInput | TaskStateCreateManyInput[]
  }

  /**
   * TaskState createManyAndReturn
   */
  export type TaskStateCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * The data used to create many TaskStates.
     */
    data: TaskStateCreateManyInput | TaskStateCreateManyInput[]
  }

  /**
   * TaskState update
   */
  export type TaskStateUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * The data needed to update a TaskState.
     */
    data: XOR<TaskStateUpdateInput, TaskStateUncheckedUpdateInput>
    /**
     * Choose, which TaskState to update.
     */
    where: TaskStateWhereUniqueInput
  }

  /**
   * TaskState updateMany
   */
  export type TaskStateUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update TaskStates.
     */
    data: XOR<TaskStateUpdateManyMutationInput, TaskStateUncheckedUpdateManyInput>
    /**
     * Filter which TaskStates to update
     */
    where?: TaskStateWhereInput
    /**
     * Limit how many TaskStates to update.
     */
    limit?: number
  }

  /**
   * TaskState updateManyAndReturn
   */
  export type TaskStateUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * The data used to update TaskStates.
     */
    data: XOR<TaskStateUpdateManyMutationInput, TaskStateUncheckedUpdateManyInput>
    /**
     * Filter which TaskStates to update
     */
    where?: TaskStateWhereInput
    /**
     * Limit how many TaskStates to update.
     */
    limit?: number
  }

  /**
   * TaskState upsert
   */
  export type TaskStateUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * The filter to search for the TaskState to update in case it exists.
     */
    where: TaskStateWhereUniqueInput
    /**
     * In case the TaskState found by the `where` argument doesn't exist, create a new TaskState with this data.
     */
    create: XOR<TaskStateCreateInput, TaskStateUncheckedCreateInput>
    /**
     * In case the TaskState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskStateUpdateInput, TaskStateUncheckedUpdateInput>
  }

  /**
   * TaskState delete
   */
  export type TaskStateDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
    /**
     * Filter which TaskState to delete.
     */
    where: TaskStateWhereUniqueInput
  }

  /**
   * TaskState deleteMany
   */
  export type TaskStateDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which TaskStates to delete
     */
    where?: TaskStateWhereInput
    /**
     * Limit how many TaskStates to delete.
     */
    limit?: number
  }

  /**
   * TaskState without action
   */
  export type TaskStateDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TaskState
     */
    select?: TaskStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaskState
     */
    omit?: TaskStateOmit<ExtArgs> | null
  }

  /**
   * Model AcceptanceState
   */

  export type AggregateAcceptanceState = {
    _count: AcceptanceStateCountAggregateOutputType | null
    _avg: AcceptanceStateAvgAggregateOutputType | null
    _sum: AcceptanceStateSumAggregateOutputType | null
    _min: AcceptanceStateMinAggregateOutputType | null
    _max: AcceptanceStateMaxAggregateOutputType | null
  }

  export type AcceptanceStateAvgAggregateOutputType = {
    id: number | null
  }

  export type AcceptanceStateSumAggregateOutputType = {
    id: number | null
  }

  export type AcceptanceStateMinAggregateOutputType = {
    id: number | null
    envId: string | null
    projectCode: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type AcceptanceStateMaxAggregateOutputType = {
    id: number | null
    envId: string | null
    projectCode: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type AcceptanceStateCountAggregateOutputType = {
    id: number
    envId: number
    projectCode: number
    snapshotJson: number
    updatedAt: number
    _all: number
  }

  export type AcceptanceStateAvgAggregateInputType = {
    id?: true
  }

  export type AcceptanceStateSumAggregateInputType = {
    id?: true
  }

  export type AcceptanceStateMinAggregateInputType = {
    id?: true
    envId?: true
    projectCode?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type AcceptanceStateMaxAggregateInputType = {
    id?: true
    envId?: true
    projectCode?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type AcceptanceStateCountAggregateInputType = {
    id?: true
    envId?: true
    projectCode?: true
    snapshotJson?: true
    updatedAt?: true
    _all?: true
  }

  export type AcceptanceStateAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AcceptanceState to aggregate.
     */
    where?: AcceptanceStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcceptanceStates to fetch.
     */
    orderBy?: AcceptanceStateOrderByWithRelationInput | AcceptanceStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AcceptanceStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcceptanceStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcceptanceStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AcceptanceStates
     **/
    _count?: true | AcceptanceStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AcceptanceStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AcceptanceStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AcceptanceStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AcceptanceStateMaxAggregateInputType
  }

  export type GetAcceptanceStateAggregateType<T extends AcceptanceStateAggregateArgs> = {
    [P in keyof T & keyof AggregateAcceptanceState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAcceptanceState[P]>
      : GetScalarType<T[P], AggregateAcceptanceState[P]>
  }

  export type AcceptanceStateGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AcceptanceStateWhereInput
    orderBy?:
      | AcceptanceStateOrderByWithAggregationInput
      | AcceptanceStateOrderByWithAggregationInput[]
    by: AcceptanceStateScalarFieldEnum[] | AcceptanceStateScalarFieldEnum
    having?: AcceptanceStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AcceptanceStateCountAggregateInputType | true
    _avg?: AcceptanceStateAvgAggregateInputType
    _sum?: AcceptanceStateSumAggregateInputType
    _min?: AcceptanceStateMinAggregateInputType
    _max?: AcceptanceStateMaxAggregateInputType
  }

  export type AcceptanceStateGroupByOutputType = {
    id: number
    envId: string
    projectCode: string
    snapshotJson: string
    updatedAt: Date
    _count: AcceptanceStateCountAggregateOutputType | null
    _avg: AcceptanceStateAvgAggregateOutputType | null
    _sum: AcceptanceStateSumAggregateOutputType | null
    _min: AcceptanceStateMinAggregateOutputType | null
    _max: AcceptanceStateMaxAggregateOutputType | null
  }

  type GetAcceptanceStateGroupByPayload<T extends AcceptanceStateGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AcceptanceStateGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AcceptanceStateGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AcceptanceStateGroupByOutputType[P]>
            : GetScalarType<T[P], AcceptanceStateGroupByOutputType[P]>
        }
      >
    >

  export type AcceptanceStateSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      projectCode?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['acceptanceState']
  >

  export type AcceptanceStateSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      projectCode?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['acceptanceState']
  >

  export type AcceptanceStateSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      projectCode?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['acceptanceState']
  >

  export type AcceptanceStateSelectScalar = {
    id?: boolean
    envId?: boolean
    projectCode?: boolean
    snapshotJson?: boolean
    updatedAt?: boolean
  }

  export type AcceptanceStateOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'envId' | 'projectCode' | 'snapshotJson' | 'updatedAt',
    ExtArgs['result']['acceptanceState']
  >

  export type $AcceptanceStatePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AcceptanceState'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        envId: string
        projectCode: string
        snapshotJson: string
        updatedAt: Date
      },
      ExtArgs['result']['acceptanceState']
    >
    composites: {}
  }

  type AcceptanceStateGetPayload<
    S extends boolean | null | undefined | AcceptanceStateDefaultArgs,
  > = $Result.GetResult<Prisma.$AcceptanceStatePayload, S>

  type AcceptanceStateCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AcceptanceStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AcceptanceStateCountAggregateInputType | true
  }

  export interface AcceptanceStateDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AcceptanceState']
      meta: { name: 'AcceptanceState' }
    }
    /**
     * Find zero or one AcceptanceState that matches the filter.
     * @param {AcceptanceStateFindUniqueArgs} args - Arguments to find a AcceptanceState
     * @example
     * // Get one AcceptanceState
     * const acceptanceState = await prisma.acceptanceState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AcceptanceStateFindUniqueArgs>(
      args: SelectSubset<T, AcceptanceStateFindUniqueArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<
        Prisma.$AcceptanceStatePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one AcceptanceState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AcceptanceStateFindUniqueOrThrowArgs} args - Arguments to find a AcceptanceState
     * @example
     * // Get one AcceptanceState
     * const acceptanceState = await prisma.acceptanceState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AcceptanceStateFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AcceptanceStateFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<
        Prisma.$AcceptanceStatePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first AcceptanceState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateFindFirstArgs} args - Arguments to find a AcceptanceState
     * @example
     * // Get one AcceptanceState
     * const acceptanceState = await prisma.acceptanceState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AcceptanceStateFindFirstArgs>(
      args?: SelectSubset<T, AcceptanceStateFindFirstArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<
        Prisma.$AcceptanceStatePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first AcceptanceState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateFindFirstOrThrowArgs} args - Arguments to find a AcceptanceState
     * @example
     * // Get one AcceptanceState
     * const acceptanceState = await prisma.acceptanceState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AcceptanceStateFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AcceptanceStateFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<
        Prisma.$AcceptanceStatePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more AcceptanceStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AcceptanceStates
     * const acceptanceStates = await prisma.acceptanceState.findMany()
     *
     * // Get first 10 AcceptanceStates
     * const acceptanceStates = await prisma.acceptanceState.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const acceptanceStateWithIdOnly = await prisma.acceptanceState.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AcceptanceStateFindManyArgs>(
      args?: SelectSubset<T, AcceptanceStateFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AcceptanceStatePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a AcceptanceState.
     * @param {AcceptanceStateCreateArgs} args - Arguments to create a AcceptanceState.
     * @example
     * // Create one AcceptanceState
     * const AcceptanceState = await prisma.acceptanceState.create({
     *   data: {
     *     // ... data to create a AcceptanceState
     *   }
     * })
     *
     */
    create<T extends AcceptanceStateCreateArgs>(
      args: SelectSubset<T, AcceptanceStateCreateArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<Prisma.$AcceptanceStatePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many AcceptanceStates.
     * @param {AcceptanceStateCreateManyArgs} args - Arguments to create many AcceptanceStates.
     * @example
     * // Create many AcceptanceStates
     * const acceptanceState = await prisma.acceptanceState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AcceptanceStateCreateManyArgs>(
      args?: SelectSubset<T, AcceptanceStateCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AcceptanceStates and returns the data saved in the database.
     * @param {AcceptanceStateCreateManyAndReturnArgs} args - Arguments to create many AcceptanceStates.
     * @example
     * // Create many AcceptanceStates
     * const acceptanceState = await prisma.acceptanceState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AcceptanceStates and only return the `id`
     * const acceptanceStateWithIdOnly = await prisma.acceptanceState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AcceptanceStateCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AcceptanceStateCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AcceptanceStatePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a AcceptanceState.
     * @param {AcceptanceStateDeleteArgs} args - Arguments to delete one AcceptanceState.
     * @example
     * // Delete one AcceptanceState
     * const AcceptanceState = await prisma.acceptanceState.delete({
     *   where: {
     *     // ... filter to delete one AcceptanceState
     *   }
     * })
     *
     */
    delete<T extends AcceptanceStateDeleteArgs>(
      args: SelectSubset<T, AcceptanceStateDeleteArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<Prisma.$AcceptanceStatePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one AcceptanceState.
     * @param {AcceptanceStateUpdateArgs} args - Arguments to update one AcceptanceState.
     * @example
     * // Update one AcceptanceState
     * const acceptanceState = await prisma.acceptanceState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AcceptanceStateUpdateArgs>(
      args: SelectSubset<T, AcceptanceStateUpdateArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<Prisma.$AcceptanceStatePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more AcceptanceStates.
     * @param {AcceptanceStateDeleteManyArgs} args - Arguments to filter AcceptanceStates to delete.
     * @example
     * // Delete a few AcceptanceStates
     * const { count } = await prisma.acceptanceState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AcceptanceStateDeleteManyArgs>(
      args?: SelectSubset<T, AcceptanceStateDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AcceptanceStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AcceptanceStates
     * const acceptanceState = await prisma.acceptanceState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AcceptanceStateUpdateManyArgs>(
      args: SelectSubset<T, AcceptanceStateUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AcceptanceStates and returns the data updated in the database.
     * @param {AcceptanceStateUpdateManyAndReturnArgs} args - Arguments to update many AcceptanceStates.
     * @example
     * // Update many AcceptanceStates
     * const acceptanceState = await prisma.acceptanceState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AcceptanceStates and only return the `id`
     * const acceptanceStateWithIdOnly = await prisma.acceptanceState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AcceptanceStateUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AcceptanceStateUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AcceptanceStatePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one AcceptanceState.
     * @param {AcceptanceStateUpsertArgs} args - Arguments to update or create a AcceptanceState.
     * @example
     * // Update or create a AcceptanceState
     * const acceptanceState = await prisma.acceptanceState.upsert({
     *   create: {
     *     // ... data to create a AcceptanceState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AcceptanceState we want to update
     *   }
     * })
     */
    upsert<T extends AcceptanceStateUpsertArgs>(
      args: SelectSubset<T, AcceptanceStateUpsertArgs<ExtArgs>>
    ): Prisma__AcceptanceStateClient<
      $Result.GetResult<Prisma.$AcceptanceStatePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of AcceptanceStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateCountArgs} args - Arguments to filter AcceptanceStates to count.
     * @example
     * // Count the number of AcceptanceStates
     * const count = await prisma.acceptanceState.count({
     *   where: {
     *     // ... the filter for the AcceptanceStates we want to count
     *   }
     * })
     **/
    count<T extends AcceptanceStateCountArgs>(
      args?: Subset<T, AcceptanceStateCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AcceptanceStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AcceptanceState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AcceptanceStateAggregateArgs>(
      args: Subset<T, AcceptanceStateAggregateArgs>
    ): Prisma.PrismaPromise<GetAcceptanceStateAggregateType<T>>

    /**
     * Group by AcceptanceState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcceptanceStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AcceptanceStateGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AcceptanceStateGroupByArgs['orderBy'] }
        : { orderBy?: AcceptanceStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AcceptanceStateGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetAcceptanceStateGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AcceptanceState model
     */
    readonly fields: AcceptanceStateFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AcceptanceState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AcceptanceStateClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AcceptanceState model
   */
  interface AcceptanceStateFieldRefs {
    readonly id: FieldRef<'AcceptanceState', 'Int'>
    readonly envId: FieldRef<'AcceptanceState', 'String'>
    readonly projectCode: FieldRef<'AcceptanceState', 'String'>
    readonly snapshotJson: FieldRef<'AcceptanceState', 'String'>
    readonly updatedAt: FieldRef<'AcceptanceState', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * AcceptanceState findUnique
   */
  export type AcceptanceStateFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * Filter, which AcceptanceState to fetch.
     */
    where: AcceptanceStateWhereUniqueInput
  }

  /**
   * AcceptanceState findUniqueOrThrow
   */
  export type AcceptanceStateFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * Filter, which AcceptanceState to fetch.
     */
    where: AcceptanceStateWhereUniqueInput
  }

  /**
   * AcceptanceState findFirst
   */
  export type AcceptanceStateFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * Filter, which AcceptanceState to fetch.
     */
    where?: AcceptanceStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcceptanceStates to fetch.
     */
    orderBy?: AcceptanceStateOrderByWithRelationInput | AcceptanceStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AcceptanceStates.
     */
    cursor?: AcceptanceStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcceptanceStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcceptanceStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AcceptanceStates.
     */
    distinct?: AcceptanceStateScalarFieldEnum | AcceptanceStateScalarFieldEnum[]
  }

  /**
   * AcceptanceState findFirstOrThrow
   */
  export type AcceptanceStateFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * Filter, which AcceptanceState to fetch.
     */
    where?: AcceptanceStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcceptanceStates to fetch.
     */
    orderBy?: AcceptanceStateOrderByWithRelationInput | AcceptanceStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AcceptanceStates.
     */
    cursor?: AcceptanceStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcceptanceStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcceptanceStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AcceptanceStates.
     */
    distinct?: AcceptanceStateScalarFieldEnum | AcceptanceStateScalarFieldEnum[]
  }

  /**
   * AcceptanceState findMany
   */
  export type AcceptanceStateFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * Filter, which AcceptanceStates to fetch.
     */
    where?: AcceptanceStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AcceptanceStates to fetch.
     */
    orderBy?: AcceptanceStateOrderByWithRelationInput | AcceptanceStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AcceptanceStates.
     */
    cursor?: AcceptanceStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AcceptanceStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AcceptanceStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AcceptanceStates.
     */
    distinct?: AcceptanceStateScalarFieldEnum | AcceptanceStateScalarFieldEnum[]
  }

  /**
   * AcceptanceState create
   */
  export type AcceptanceStateCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * The data needed to create a AcceptanceState.
     */
    data: XOR<AcceptanceStateCreateInput, AcceptanceStateUncheckedCreateInput>
  }

  /**
   * AcceptanceState createMany
   */
  export type AcceptanceStateCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AcceptanceStates.
     */
    data: AcceptanceStateCreateManyInput | AcceptanceStateCreateManyInput[]
  }

  /**
   * AcceptanceState createManyAndReturn
   */
  export type AcceptanceStateCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * The data used to create many AcceptanceStates.
     */
    data: AcceptanceStateCreateManyInput | AcceptanceStateCreateManyInput[]
  }

  /**
   * AcceptanceState update
   */
  export type AcceptanceStateUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * The data needed to update a AcceptanceState.
     */
    data: XOR<AcceptanceStateUpdateInput, AcceptanceStateUncheckedUpdateInput>
    /**
     * Choose, which AcceptanceState to update.
     */
    where: AcceptanceStateWhereUniqueInput
  }

  /**
   * AcceptanceState updateMany
   */
  export type AcceptanceStateUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AcceptanceStates.
     */
    data: XOR<AcceptanceStateUpdateManyMutationInput, AcceptanceStateUncheckedUpdateManyInput>
    /**
     * Filter which AcceptanceStates to update
     */
    where?: AcceptanceStateWhereInput
    /**
     * Limit how many AcceptanceStates to update.
     */
    limit?: number
  }

  /**
   * AcceptanceState updateManyAndReturn
   */
  export type AcceptanceStateUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * The data used to update AcceptanceStates.
     */
    data: XOR<AcceptanceStateUpdateManyMutationInput, AcceptanceStateUncheckedUpdateManyInput>
    /**
     * Filter which AcceptanceStates to update
     */
    where?: AcceptanceStateWhereInput
    /**
     * Limit how many AcceptanceStates to update.
     */
    limit?: number
  }

  /**
   * AcceptanceState upsert
   */
  export type AcceptanceStateUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * The filter to search for the AcceptanceState to update in case it exists.
     */
    where: AcceptanceStateWhereUniqueInput
    /**
     * In case the AcceptanceState found by the `where` argument doesn't exist, create a new AcceptanceState with this data.
     */
    create: XOR<AcceptanceStateCreateInput, AcceptanceStateUncheckedCreateInput>
    /**
     * In case the AcceptanceState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AcceptanceStateUpdateInput, AcceptanceStateUncheckedUpdateInput>
  }

  /**
   * AcceptanceState delete
   */
  export type AcceptanceStateDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
    /**
     * Filter which AcceptanceState to delete.
     */
    where: AcceptanceStateWhereUniqueInput
  }

  /**
   * AcceptanceState deleteMany
   */
  export type AcceptanceStateDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AcceptanceStates to delete
     */
    where?: AcceptanceStateWhereInput
    /**
     * Limit how many AcceptanceStates to delete.
     */
    limit?: number
  }

  /**
   * AcceptanceState without action
   */
  export type AcceptanceStateDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AcceptanceState
     */
    select?: AcceptanceStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AcceptanceState
     */
    omit?: AcceptanceStateOmit<ExtArgs> | null
  }

  /**
   * Model SettlementState
   */

  export type AggregateSettlementState = {
    _count: SettlementStateCountAggregateOutputType | null
    _avg: SettlementStateAvgAggregateOutputType | null
    _sum: SettlementStateSumAggregateOutputType | null
    _min: SettlementStateMinAggregateOutputType | null
    _max: SettlementStateMaxAggregateOutputType | null
  }

  export type SettlementStateAvgAggregateOutputType = {
    id: number | null
  }

  export type SettlementStateSumAggregateOutputType = {
    id: number | null
  }

  export type SettlementStateMinAggregateOutputType = {
    id: number | null
    envId: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type SettlementStateMaxAggregateOutputType = {
    id: number | null
    envId: string | null
    snapshotJson: string | null
    updatedAt: Date | null
  }

  export type SettlementStateCountAggregateOutputType = {
    id: number
    envId: number
    snapshotJson: number
    updatedAt: number
    _all: number
  }

  export type SettlementStateAvgAggregateInputType = {
    id?: true
  }

  export type SettlementStateSumAggregateInputType = {
    id?: true
  }

  export type SettlementStateMinAggregateInputType = {
    id?: true
    envId?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type SettlementStateMaxAggregateInputType = {
    id?: true
    envId?: true
    snapshotJson?: true
    updatedAt?: true
  }

  export type SettlementStateCountAggregateInputType = {
    id?: true
    envId?: true
    snapshotJson?: true
    updatedAt?: true
    _all?: true
  }

  export type SettlementStateAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SettlementState to aggregate.
     */
    where?: SettlementStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SettlementStates to fetch.
     */
    orderBy?: SettlementStateOrderByWithRelationInput | SettlementStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SettlementStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SettlementStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SettlementStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SettlementStates
     **/
    _count?: true | SettlementStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: SettlementStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: SettlementStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SettlementStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SettlementStateMaxAggregateInputType
  }

  export type GetSettlementStateAggregateType<T extends SettlementStateAggregateArgs> = {
    [P in keyof T & keyof AggregateSettlementState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettlementState[P]>
      : GetScalarType<T[P], AggregateSettlementState[P]>
  }

  export type SettlementStateGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SettlementStateWhereInput
    orderBy?:
      | SettlementStateOrderByWithAggregationInput
      | SettlementStateOrderByWithAggregationInput[]
    by: SettlementStateScalarFieldEnum[] | SettlementStateScalarFieldEnum
    having?: SettlementStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettlementStateCountAggregateInputType | true
    _avg?: SettlementStateAvgAggregateInputType
    _sum?: SettlementStateSumAggregateInputType
    _min?: SettlementStateMinAggregateInputType
    _max?: SettlementStateMaxAggregateInputType
  }

  export type SettlementStateGroupByOutputType = {
    id: number
    envId: string
    snapshotJson: string
    updatedAt: Date
    _count: SettlementStateCountAggregateOutputType | null
    _avg: SettlementStateAvgAggregateOutputType | null
    _sum: SettlementStateSumAggregateOutputType | null
    _min: SettlementStateMinAggregateOutputType | null
    _max: SettlementStateMaxAggregateOutputType | null
  }

  type GetSettlementStateGroupByPayload<T extends SettlementStateGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<SettlementStateGroupByOutputType, T['by']> & {
          [P in keyof T & keyof SettlementStateGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettlementStateGroupByOutputType[P]>
            : GetScalarType<T[P], SettlementStateGroupByOutputType[P]>
        }
      >
    >

  export type SettlementStateSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['settlementState']
  >

  export type SettlementStateSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['settlementState']
  >

  export type SettlementStateSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      snapshotJson?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['settlementState']
  >

  export type SettlementStateSelectScalar = {
    id?: boolean
    envId?: boolean
    snapshotJson?: boolean
    updatedAt?: boolean
  }

  export type SettlementStateOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'envId' | 'snapshotJson' | 'updatedAt',
    ExtArgs['result']['settlementState']
  >

  export type $SettlementStatePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'SettlementState'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        envId: string
        snapshotJson: string
        updatedAt: Date
      },
      ExtArgs['result']['settlementState']
    >
    composites: {}
  }

  type SettlementStateGetPayload<
    S extends boolean | null | undefined | SettlementStateDefaultArgs,
  > = $Result.GetResult<Prisma.$SettlementStatePayload, S>

  type SettlementStateCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<SettlementStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SettlementStateCountAggregateInputType | true
  }

  export interface SettlementStateDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['SettlementState']
      meta: { name: 'SettlementState' }
    }
    /**
     * Find zero or one SettlementState that matches the filter.
     * @param {SettlementStateFindUniqueArgs} args - Arguments to find a SettlementState
     * @example
     * // Get one SettlementState
     * const settlementState = await prisma.settlementState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettlementStateFindUniqueArgs>(
      args: SelectSubset<T, SettlementStateFindUniqueArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<
        Prisma.$SettlementStatePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one SettlementState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettlementStateFindUniqueOrThrowArgs} args - Arguments to find a SettlementState
     * @example
     * // Get one SettlementState
     * const settlementState = await prisma.settlementState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettlementStateFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SettlementStateFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<
        Prisma.$SettlementStatePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SettlementState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateFindFirstArgs} args - Arguments to find a SettlementState
     * @example
     * // Get one SettlementState
     * const settlementState = await prisma.settlementState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettlementStateFindFirstArgs>(
      args?: SelectSubset<T, SettlementStateFindFirstArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<
        Prisma.$SettlementStatePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SettlementState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateFindFirstOrThrowArgs} args - Arguments to find a SettlementState
     * @example
     * // Get one SettlementState
     * const settlementState = await prisma.settlementState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettlementStateFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SettlementStateFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<
        Prisma.$SettlementStatePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more SettlementStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SettlementStates
     * const settlementStates = await prisma.settlementState.findMany()
     *
     * // Get first 10 SettlementStates
     * const settlementStates = await prisma.settlementState.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const settlementStateWithIdOnly = await prisma.settlementState.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SettlementStateFindManyArgs>(
      args?: SelectSubset<T, SettlementStateFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SettlementStatePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a SettlementState.
     * @param {SettlementStateCreateArgs} args - Arguments to create a SettlementState.
     * @example
     * // Create one SettlementState
     * const SettlementState = await prisma.settlementState.create({
     *   data: {
     *     // ... data to create a SettlementState
     *   }
     * })
     *
     */
    create<T extends SettlementStateCreateArgs>(
      args: SelectSubset<T, SettlementStateCreateArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<Prisma.$SettlementStatePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many SettlementStates.
     * @param {SettlementStateCreateManyArgs} args - Arguments to create many SettlementStates.
     * @example
     * // Create many SettlementStates
     * const settlementState = await prisma.settlementState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SettlementStateCreateManyArgs>(
      args?: SelectSubset<T, SettlementStateCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SettlementStates and returns the data saved in the database.
     * @param {SettlementStateCreateManyAndReturnArgs} args - Arguments to create many SettlementStates.
     * @example
     * // Create many SettlementStates
     * const settlementState = await prisma.settlementState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many SettlementStates and only return the `id`
     * const settlementStateWithIdOnly = await prisma.settlementState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SettlementStateCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SettlementStateCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SettlementStatePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a SettlementState.
     * @param {SettlementStateDeleteArgs} args - Arguments to delete one SettlementState.
     * @example
     * // Delete one SettlementState
     * const SettlementState = await prisma.settlementState.delete({
     *   where: {
     *     // ... filter to delete one SettlementState
     *   }
     * })
     *
     */
    delete<T extends SettlementStateDeleteArgs>(
      args: SelectSubset<T, SettlementStateDeleteArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<Prisma.$SettlementStatePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one SettlementState.
     * @param {SettlementStateUpdateArgs} args - Arguments to update one SettlementState.
     * @example
     * // Update one SettlementState
     * const settlementState = await prisma.settlementState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SettlementStateUpdateArgs>(
      args: SelectSubset<T, SettlementStateUpdateArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<Prisma.$SettlementStatePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more SettlementStates.
     * @param {SettlementStateDeleteManyArgs} args - Arguments to filter SettlementStates to delete.
     * @example
     * // Delete a few SettlementStates
     * const { count } = await prisma.settlementState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SettlementStateDeleteManyArgs>(
      args?: SelectSubset<T, SettlementStateDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SettlementStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SettlementStates
     * const settlementState = await prisma.settlementState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SettlementStateUpdateManyArgs>(
      args: SelectSubset<T, SettlementStateUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SettlementStates and returns the data updated in the database.
     * @param {SettlementStateUpdateManyAndReturnArgs} args - Arguments to update many SettlementStates.
     * @example
     * // Update many SettlementStates
     * const settlementState = await prisma.settlementState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more SettlementStates and only return the `id`
     * const settlementStateWithIdOnly = await prisma.settlementState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SettlementStateUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SettlementStateUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SettlementStatePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one SettlementState.
     * @param {SettlementStateUpsertArgs} args - Arguments to update or create a SettlementState.
     * @example
     * // Update or create a SettlementState
     * const settlementState = await prisma.settlementState.upsert({
     *   create: {
     *     // ... data to create a SettlementState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SettlementState we want to update
     *   }
     * })
     */
    upsert<T extends SettlementStateUpsertArgs>(
      args: SelectSubset<T, SettlementStateUpsertArgs<ExtArgs>>
    ): Prisma__SettlementStateClient<
      $Result.GetResult<Prisma.$SettlementStatePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of SettlementStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateCountArgs} args - Arguments to filter SettlementStates to count.
     * @example
     * // Count the number of SettlementStates
     * const count = await prisma.settlementState.count({
     *   where: {
     *     // ... the filter for the SettlementStates we want to count
     *   }
     * })
     **/
    count<T extends SettlementStateCountArgs>(
      args?: Subset<T, SettlementStateCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettlementStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SettlementState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SettlementStateAggregateArgs>(
      args: Subset<T, SettlementStateAggregateArgs>
    ): Prisma.PrismaPromise<GetSettlementStateAggregateType<T>>

    /**
     * Group by SettlementState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettlementStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SettlementStateGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettlementStateGroupByArgs['orderBy'] }
        : { orderBy?: SettlementStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SettlementStateGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetSettlementStateGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the SettlementState model
     */
    readonly fields: SettlementStateFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for SettlementState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettlementStateClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the SettlementState model
   */
  interface SettlementStateFieldRefs {
    readonly id: FieldRef<'SettlementState', 'Int'>
    readonly envId: FieldRef<'SettlementState', 'String'>
    readonly snapshotJson: FieldRef<'SettlementState', 'String'>
    readonly updatedAt: FieldRef<'SettlementState', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * SettlementState findUnique
   */
  export type SettlementStateFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * Filter, which SettlementState to fetch.
     */
    where: SettlementStateWhereUniqueInput
  }

  /**
   * SettlementState findUniqueOrThrow
   */
  export type SettlementStateFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * Filter, which SettlementState to fetch.
     */
    where: SettlementStateWhereUniqueInput
  }

  /**
   * SettlementState findFirst
   */
  export type SettlementStateFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * Filter, which SettlementState to fetch.
     */
    where?: SettlementStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SettlementStates to fetch.
     */
    orderBy?: SettlementStateOrderByWithRelationInput | SettlementStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SettlementStates.
     */
    cursor?: SettlementStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SettlementStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SettlementStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SettlementStates.
     */
    distinct?: SettlementStateScalarFieldEnum | SettlementStateScalarFieldEnum[]
  }

  /**
   * SettlementState findFirstOrThrow
   */
  export type SettlementStateFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * Filter, which SettlementState to fetch.
     */
    where?: SettlementStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SettlementStates to fetch.
     */
    orderBy?: SettlementStateOrderByWithRelationInput | SettlementStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SettlementStates.
     */
    cursor?: SettlementStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SettlementStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SettlementStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SettlementStates.
     */
    distinct?: SettlementStateScalarFieldEnum | SettlementStateScalarFieldEnum[]
  }

  /**
   * SettlementState findMany
   */
  export type SettlementStateFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * Filter, which SettlementStates to fetch.
     */
    where?: SettlementStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SettlementStates to fetch.
     */
    orderBy?: SettlementStateOrderByWithRelationInput | SettlementStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SettlementStates.
     */
    cursor?: SettlementStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SettlementStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SettlementStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SettlementStates.
     */
    distinct?: SettlementStateScalarFieldEnum | SettlementStateScalarFieldEnum[]
  }

  /**
   * SettlementState create
   */
  export type SettlementStateCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * The data needed to create a SettlementState.
     */
    data: XOR<SettlementStateCreateInput, SettlementStateUncheckedCreateInput>
  }

  /**
   * SettlementState createMany
   */
  export type SettlementStateCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many SettlementStates.
     */
    data: SettlementStateCreateManyInput | SettlementStateCreateManyInput[]
  }

  /**
   * SettlementState createManyAndReturn
   */
  export type SettlementStateCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * The data used to create many SettlementStates.
     */
    data: SettlementStateCreateManyInput | SettlementStateCreateManyInput[]
  }

  /**
   * SettlementState update
   */
  export type SettlementStateUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * The data needed to update a SettlementState.
     */
    data: XOR<SettlementStateUpdateInput, SettlementStateUncheckedUpdateInput>
    /**
     * Choose, which SettlementState to update.
     */
    where: SettlementStateWhereUniqueInput
  }

  /**
   * SettlementState updateMany
   */
  export type SettlementStateUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update SettlementStates.
     */
    data: XOR<SettlementStateUpdateManyMutationInput, SettlementStateUncheckedUpdateManyInput>
    /**
     * Filter which SettlementStates to update
     */
    where?: SettlementStateWhereInput
    /**
     * Limit how many SettlementStates to update.
     */
    limit?: number
  }

  /**
   * SettlementState updateManyAndReturn
   */
  export type SettlementStateUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * The data used to update SettlementStates.
     */
    data: XOR<SettlementStateUpdateManyMutationInput, SettlementStateUncheckedUpdateManyInput>
    /**
     * Filter which SettlementStates to update
     */
    where?: SettlementStateWhereInput
    /**
     * Limit how many SettlementStates to update.
     */
    limit?: number
  }

  /**
   * SettlementState upsert
   */
  export type SettlementStateUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * The filter to search for the SettlementState to update in case it exists.
     */
    where: SettlementStateWhereUniqueInput
    /**
     * In case the SettlementState found by the `where` argument doesn't exist, create a new SettlementState with this data.
     */
    create: XOR<SettlementStateCreateInput, SettlementStateUncheckedCreateInput>
    /**
     * In case the SettlementState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettlementStateUpdateInput, SettlementStateUncheckedUpdateInput>
  }

  /**
   * SettlementState delete
   */
  export type SettlementStateDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
    /**
     * Filter which SettlementState to delete.
     */
    where: SettlementStateWhereUniqueInput
  }

  /**
   * SettlementState deleteMany
   */
  export type SettlementStateDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which SettlementStates to delete
     */
    where?: SettlementStateWhereInput
    /**
     * Limit how many SettlementStates to delete.
     */
    limit?: number
  }

  /**
   * SettlementState without action
   */
  export type SettlementStateDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the SettlementState
     */
    select?: SettlementStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SettlementState
     */
    omit?: SettlementStateOmit<ExtArgs> | null
  }

  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    id: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    id: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: number | null
    envId: string | null
    scene: string | null
    detail: string | null
    projectCode: string | null
    at: Date | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: number | null
    envId: string | null
    scene: string | null
    detail: string | null
    projectCode: string | null
    at: Date | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    envId: number
    scene: number
    detail: number
    projectCode: number
    at: number
    createdAt: number
    _all: number
  }

  export type AuditLogAvgAggregateInputType = {
    id?: true
  }

  export type AuditLogSumAggregateInputType = {
    id?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    envId?: true
    scene?: true
    detail?: true
    projectCode?: true
    at?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    envId?: true
    scene?: true
    detail?: true
    projectCode?: true
    at?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    envId?: true
    scene?: true
    detail?: true
    projectCode?: true
    at?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AuditLogs
     **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }

  export type AuditLogGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: number
    envId: string
    scene: string
    detail: string
    projectCode: string | null
    at: Date
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AuditLogGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
          : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
      }
    >
  >

  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        envId?: boolean
        scene?: boolean
        detail?: boolean
        projectCode?: boolean
        at?: boolean
        createdAt?: boolean
      },
      ExtArgs['result']['auditLog']
    >

  export type AuditLogSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      scene?: boolean
      detail?: boolean
      projectCode?: boolean
      at?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['auditLog']
  >

  export type AuditLogSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      envId?: boolean
      scene?: boolean
      detail?: boolean
      projectCode?: boolean
      at?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['auditLog']
  >

  export type AuditLogSelectScalar = {
    id?: boolean
    envId?: boolean
    scene?: boolean
    detail?: boolean
    projectCode?: boolean
    at?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'envId' | 'scene' | 'detail' | 'projectCode' | 'at' | 'createdAt',
      ExtArgs['result']['auditLog']
    >

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'AuditLog'
      objects: {}
      scalars: $Extensions.GetPayloadResult<
        {
          id: number
          envId: string
          scene: string
          detail: string
          projectCode: string | null
          at: Date
          createdAt: Date
        },
        ExtArgs['result']['auditLog']
      >
      composites: {}
    }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> =
    $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AuditLogFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: AuditLogCountAggregateInputType | true
  }

  export interface AuditLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog']; meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(
      args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(
      args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     *
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AuditLogFindManyArgs>(
      args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     *
     */
    create<T extends AuditLogCreateArgs>(
      args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AuditLogCreateManyArgs>(
      args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     *
     */
    delete<T extends AuditLogDeleteArgs>(
      args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AuditLogUpdateArgs>(
      args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(
      args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AuditLogUpdateManyArgs>(
      args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(
      args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
     **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AuditLogAggregateArgs>(
      args: Subset<T, AuditLogAggregateArgs>
    ): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the AuditLog model
     */
    readonly fields: AuditLogFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<'AuditLog', 'Int'>
    readonly envId: FieldRef<'AuditLog', 'String'>
    readonly scene: FieldRef<'AuditLog', 'String'>
    readonly detail: FieldRef<'AuditLog', 'String'>
    readonly projectCode: FieldRef<'AuditLog', 'String'>
    readonly at: FieldRef<'AuditLog', 'DateTime'>
    readonly createdAt: FieldRef<'AuditLog', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }

  /**
   * Model IdempotencyKey
   */

  export type AggregateIdempotencyKey = {
    _count: IdempotencyKeyCountAggregateOutputType | null
    _avg: IdempotencyKeyAvgAggregateOutputType | null
    _sum: IdempotencyKeySumAggregateOutputType | null
    _min: IdempotencyKeyMinAggregateOutputType | null
    _max: IdempotencyKeyMaxAggregateOutputType | null
  }

  export type IdempotencyKeyAvgAggregateOutputType = {
    responseStatus: number | null
  }

  export type IdempotencyKeySumAggregateOutputType = {
    responseStatus: number | null
  }

  export type IdempotencyKeyMinAggregateOutputType = {
    key: string | null
    scope: string | null
    envId: string | null
    requestHash: string | null
    responseStatus: number | null
    responseBody: string | null
    createdAt: Date | null
    expiredAt: Date | null
  }

  export type IdempotencyKeyMaxAggregateOutputType = {
    key: string | null
    scope: string | null
    envId: string | null
    requestHash: string | null
    responseStatus: number | null
    responseBody: string | null
    createdAt: Date | null
    expiredAt: Date | null
  }

  export type IdempotencyKeyCountAggregateOutputType = {
    key: number
    scope: number
    envId: number
    requestHash: number
    responseStatus: number
    responseBody: number
    createdAt: number
    expiredAt: number
    _all: number
  }

  export type IdempotencyKeyAvgAggregateInputType = {
    responseStatus?: true
  }

  export type IdempotencyKeySumAggregateInputType = {
    responseStatus?: true
  }

  export type IdempotencyKeyMinAggregateInputType = {
    key?: true
    scope?: true
    envId?: true
    requestHash?: true
    responseStatus?: true
    responseBody?: true
    createdAt?: true
    expiredAt?: true
  }

  export type IdempotencyKeyMaxAggregateInputType = {
    key?: true
    scope?: true
    envId?: true
    requestHash?: true
    responseStatus?: true
    responseBody?: true
    createdAt?: true
    expiredAt?: true
  }

  export type IdempotencyKeyCountAggregateInputType = {
    key?: true
    scope?: true
    envId?: true
    requestHash?: true
    responseStatus?: true
    responseBody?: true
    createdAt?: true
    expiredAt?: true
    _all?: true
  }

  export type IdempotencyKeyAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which IdempotencyKey to aggregate.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IdempotencyKeys
     **/
    _count?: true | IdempotencyKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: IdempotencyKeyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: IdempotencyKeySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: IdempotencyKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: IdempotencyKeyMaxAggregateInputType
  }

  export type GetIdempotencyKeyAggregateType<T extends IdempotencyKeyAggregateArgs> = {
    [P in keyof T & keyof AggregateIdempotencyKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdempotencyKey[P]>
      : GetScalarType<T[P], AggregateIdempotencyKey[P]>
  }

  export type IdempotencyKeyGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: IdempotencyKeyWhereInput
    orderBy?:
      | IdempotencyKeyOrderByWithAggregationInput
      | IdempotencyKeyOrderByWithAggregationInput[]
    by: IdempotencyKeyScalarFieldEnum[] | IdempotencyKeyScalarFieldEnum
    having?: IdempotencyKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdempotencyKeyCountAggregateInputType | true
    _avg?: IdempotencyKeyAvgAggregateInputType
    _sum?: IdempotencyKeySumAggregateInputType
    _min?: IdempotencyKeyMinAggregateInputType
    _max?: IdempotencyKeyMaxAggregateInputType
  }

  export type IdempotencyKeyGroupByOutputType = {
    key: string
    scope: string
    envId: string
    requestHash: string
    responseStatus: number
    responseBody: string | null
    createdAt: Date
    expiredAt: Date
    _count: IdempotencyKeyCountAggregateOutputType | null
    _avg: IdempotencyKeyAvgAggregateOutputType | null
    _sum: IdempotencyKeySumAggregateOutputType | null
    _min: IdempotencyKeyMinAggregateOutputType | null
    _max: IdempotencyKeyMaxAggregateOutputType | null
  }

  type GetIdempotencyKeyGroupByPayload<T extends IdempotencyKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdempotencyKeyGroupByOutputType, T['by']> & {
        [P in keyof T & keyof IdempotencyKeyGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], IdempotencyKeyGroupByOutputType[P]>
          : GetScalarType<T[P], IdempotencyKeyGroupByOutputType[P]>
      }
    >
  >

  export type IdempotencyKeySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      key?: boolean
      scope?: boolean
      envId?: boolean
      requestHash?: boolean
      responseStatus?: boolean
      responseBody?: boolean
      createdAt?: boolean
      expiredAt?: boolean
    },
    ExtArgs['result']['idempotencyKey']
  >

  export type IdempotencyKeySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      key?: boolean
      scope?: boolean
      envId?: boolean
      requestHash?: boolean
      responseStatus?: boolean
      responseBody?: boolean
      createdAt?: boolean
      expiredAt?: boolean
    },
    ExtArgs['result']['idempotencyKey']
  >

  export type IdempotencyKeySelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      key?: boolean
      scope?: boolean
      envId?: boolean
      requestHash?: boolean
      responseStatus?: boolean
      responseBody?: boolean
      createdAt?: boolean
      expiredAt?: boolean
    },
    ExtArgs['result']['idempotencyKey']
  >

  export type IdempotencyKeySelectScalar = {
    key?: boolean
    scope?: boolean
    envId?: boolean
    requestHash?: boolean
    responseStatus?: boolean
    responseBody?: boolean
    createdAt?: boolean
    expiredAt?: boolean
  }

  export type IdempotencyKeyOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'key'
    | 'scope'
    | 'envId'
    | 'requestHash'
    | 'responseStatus'
    | 'responseBody'
    | 'createdAt'
    | 'expiredAt',
    ExtArgs['result']['idempotencyKey']
  >

  export type $IdempotencyKeyPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'IdempotencyKey'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        key: string
        scope: string
        envId: string
        requestHash: string
        responseStatus: number
        responseBody: string | null
        createdAt: Date
        expiredAt: Date
      },
      ExtArgs['result']['idempotencyKey']
    >
    composites: {}
  }

  type IdempotencyKeyGetPayload<S extends boolean | null | undefined | IdempotencyKeyDefaultArgs> =
    $Result.GetResult<Prisma.$IdempotencyKeyPayload, S>

  type IdempotencyKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IdempotencyKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IdempotencyKeyCountAggregateInputType | true
    }

  export interface IdempotencyKeyDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['IdempotencyKey']
      meta: { name: 'IdempotencyKey' }
    }
    /**
     * Find zero or one IdempotencyKey that matches the filter.
     * @param {IdempotencyKeyFindUniqueArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdempotencyKeyFindUniqueArgs>(
      args: SelectSubset<T, IdempotencyKeyFindUniqueArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<
        Prisma.$IdempotencyKeyPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one IdempotencyKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IdempotencyKeyFindUniqueOrThrowArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdempotencyKeyFindUniqueOrThrowArgs>(
      args: SelectSubset<T, IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<
        Prisma.$IdempotencyKeyPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first IdempotencyKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyFindFirstArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdempotencyKeyFindFirstArgs>(
      args?: SelectSubset<T, IdempotencyKeyFindFirstArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<
        Prisma.$IdempotencyKeyPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first IdempotencyKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyFindFirstOrThrowArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdempotencyKeyFindFirstOrThrowArgs>(
      args?: SelectSubset<T, IdempotencyKeyFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<
        Prisma.$IdempotencyKeyPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more IdempotencyKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IdempotencyKeys
     * const idempotencyKeys = await prisma.idempotencyKey.findMany()
     *
     * // Get first 10 IdempotencyKeys
     * const idempotencyKeys = await prisma.idempotencyKey.findMany({ take: 10 })
     *
     * // Only select the `key`
     * const idempotencyKeyWithKeyOnly = await prisma.idempotencyKey.findMany({ select: { key: true } })
     *
     */
    findMany<T extends IdempotencyKeyFindManyArgs>(
      args?: SelectSubset<T, IdempotencyKeyFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a IdempotencyKey.
     * @param {IdempotencyKeyCreateArgs} args - Arguments to create a IdempotencyKey.
     * @example
     * // Create one IdempotencyKey
     * const IdempotencyKey = await prisma.idempotencyKey.create({
     *   data: {
     *     // ... data to create a IdempotencyKey
     *   }
     * })
     *
     */
    create<T extends IdempotencyKeyCreateArgs>(
      args: SelectSubset<T, IdempotencyKeyCreateArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many IdempotencyKeys.
     * @param {IdempotencyKeyCreateManyArgs} args - Arguments to create many IdempotencyKeys.
     * @example
     * // Create many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends IdempotencyKeyCreateManyArgs>(
      args?: SelectSubset<T, IdempotencyKeyCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IdempotencyKeys and returns the data saved in the database.
     * @param {IdempotencyKeyCreateManyAndReturnArgs} args - Arguments to create many IdempotencyKeys.
     * @example
     * // Create many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many IdempotencyKeys and only return the `key`
     * const idempotencyKeyWithKeyOnly = await prisma.idempotencyKey.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends IdempotencyKeyCreateManyAndReturnArgs>(
      args?: SelectSubset<T, IdempotencyKeyCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$IdempotencyKeyPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a IdempotencyKey.
     * @param {IdempotencyKeyDeleteArgs} args - Arguments to delete one IdempotencyKey.
     * @example
     * // Delete one IdempotencyKey
     * const IdempotencyKey = await prisma.idempotencyKey.delete({
     *   where: {
     *     // ... filter to delete one IdempotencyKey
     *   }
     * })
     *
     */
    delete<T extends IdempotencyKeyDeleteArgs>(
      args: SelectSubset<T, IdempotencyKeyDeleteArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one IdempotencyKey.
     * @param {IdempotencyKeyUpdateArgs} args - Arguments to update one IdempotencyKey.
     * @example
     * // Update one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends IdempotencyKeyUpdateArgs>(
      args: SelectSubset<T, IdempotencyKeyUpdateArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more IdempotencyKeys.
     * @param {IdempotencyKeyDeleteManyArgs} args - Arguments to filter IdempotencyKeys to delete.
     * @example
     * // Delete a few IdempotencyKeys
     * const { count } = await prisma.idempotencyKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends IdempotencyKeyDeleteManyArgs>(
      args?: SelectSubset<T, IdempotencyKeyDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdempotencyKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends IdempotencyKeyUpdateManyArgs>(
      args: SelectSubset<T, IdempotencyKeyUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdempotencyKeys and returns the data updated in the database.
     * @param {IdempotencyKeyUpdateManyAndReturnArgs} args - Arguments to update many IdempotencyKeys.
     * @example
     * // Update many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more IdempotencyKeys and only return the `key`
     * const idempotencyKeyWithKeyOnly = await prisma.idempotencyKey.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends IdempotencyKeyUpdateManyAndReturnArgs>(
      args: SelectSubset<T, IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$IdempotencyKeyPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one IdempotencyKey.
     * @param {IdempotencyKeyUpsertArgs} args - Arguments to update or create a IdempotencyKey.
     * @example
     * // Update or create a IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.upsert({
     *   create: {
     *     // ... data to create a IdempotencyKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IdempotencyKey we want to update
     *   }
     * })
     */
    upsert<T extends IdempotencyKeyUpsertArgs>(
      args: SelectSubset<T, IdempotencyKeyUpsertArgs<ExtArgs>>
    ): Prisma__IdempotencyKeyClient<
      $Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of IdempotencyKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyCountArgs} args - Arguments to filter IdempotencyKeys to count.
     * @example
     * // Count the number of IdempotencyKeys
     * const count = await prisma.idempotencyKey.count({
     *   where: {
     *     // ... the filter for the IdempotencyKeys we want to count
     *   }
     * })
     **/
    count<T extends IdempotencyKeyCountArgs>(
      args?: Subset<T, IdempotencyKeyCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdempotencyKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IdempotencyKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends IdempotencyKeyAggregateArgs>(
      args: Subset<T, IdempotencyKeyAggregateArgs>
    ): Prisma.PrismaPromise<GetIdempotencyKeyAggregateType<T>>

    /**
     * Group by IdempotencyKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends IdempotencyKeyGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdempotencyKeyGroupByArgs['orderBy'] }
        : { orderBy?: IdempotencyKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, IdempotencyKeyGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetIdempotencyKeyGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the IdempotencyKey model
     */
    readonly fields: IdempotencyKeyFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for IdempotencyKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdempotencyKeyClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the IdempotencyKey model
   */
  interface IdempotencyKeyFieldRefs {
    readonly key: FieldRef<'IdempotencyKey', 'String'>
    readonly scope: FieldRef<'IdempotencyKey', 'String'>
    readonly envId: FieldRef<'IdempotencyKey', 'String'>
    readonly requestHash: FieldRef<'IdempotencyKey', 'String'>
    readonly responseStatus: FieldRef<'IdempotencyKey', 'Int'>
    readonly responseBody: FieldRef<'IdempotencyKey', 'String'>
    readonly createdAt: FieldRef<'IdempotencyKey', 'DateTime'>
    readonly expiredAt: FieldRef<'IdempotencyKey', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * IdempotencyKey findUnique
   */
  export type IdempotencyKeyFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey findUniqueOrThrow
   */
  export type IdempotencyKeyFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey findFirst
   */
  export type IdempotencyKeyFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IdempotencyKeys.
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IdempotencyKeys.
     */
    distinct?: IdempotencyKeyScalarFieldEnum | IdempotencyKeyScalarFieldEnum[]
  }

  /**
   * IdempotencyKey findFirstOrThrow
   */
  export type IdempotencyKeyFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IdempotencyKeys.
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IdempotencyKeys.
     */
    distinct?: IdempotencyKeyScalarFieldEnum | IdempotencyKeyScalarFieldEnum[]
  }

  /**
   * IdempotencyKey findMany
   */
  export type IdempotencyKeyFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKeys to fetch.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IdempotencyKeys.
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IdempotencyKeys.
     */
    distinct?: IdempotencyKeyScalarFieldEnum | IdempotencyKeyScalarFieldEnum[]
  }

  /**
   * IdempotencyKey create
   */
  export type IdempotencyKeyCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data needed to create a IdempotencyKey.
     */
    data: XOR<IdempotencyKeyCreateInput, IdempotencyKeyUncheckedCreateInput>
  }

  /**
   * IdempotencyKey createMany
   */
  export type IdempotencyKeyCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many IdempotencyKeys.
     */
    data: IdempotencyKeyCreateManyInput | IdempotencyKeyCreateManyInput[]
  }

  /**
   * IdempotencyKey createManyAndReturn
   */
  export type IdempotencyKeyCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data used to create many IdempotencyKeys.
     */
    data: IdempotencyKeyCreateManyInput | IdempotencyKeyCreateManyInput[]
  }

  /**
   * IdempotencyKey update
   */
  export type IdempotencyKeyUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data needed to update a IdempotencyKey.
     */
    data: XOR<IdempotencyKeyUpdateInput, IdempotencyKeyUncheckedUpdateInput>
    /**
     * Choose, which IdempotencyKey to update.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey updateMany
   */
  export type IdempotencyKeyUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update IdempotencyKeys.
     */
    data: XOR<IdempotencyKeyUpdateManyMutationInput, IdempotencyKeyUncheckedUpdateManyInput>
    /**
     * Filter which IdempotencyKeys to update
     */
    where?: IdempotencyKeyWhereInput
    /**
     * Limit how many IdempotencyKeys to update.
     */
    limit?: number
  }

  /**
   * IdempotencyKey updateManyAndReturn
   */
  export type IdempotencyKeyUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data used to update IdempotencyKeys.
     */
    data: XOR<IdempotencyKeyUpdateManyMutationInput, IdempotencyKeyUncheckedUpdateManyInput>
    /**
     * Filter which IdempotencyKeys to update
     */
    where?: IdempotencyKeyWhereInput
    /**
     * Limit how many IdempotencyKeys to update.
     */
    limit?: number
  }

  /**
   * IdempotencyKey upsert
   */
  export type IdempotencyKeyUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The filter to search for the IdempotencyKey to update in case it exists.
     */
    where: IdempotencyKeyWhereUniqueInput
    /**
     * In case the IdempotencyKey found by the `where` argument doesn't exist, create a new IdempotencyKey with this data.
     */
    create: XOR<IdempotencyKeyCreateInput, IdempotencyKeyUncheckedCreateInput>
    /**
     * In case the IdempotencyKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdempotencyKeyUpdateInput, IdempotencyKeyUncheckedUpdateInput>
  }

  /**
   * IdempotencyKey delete
   */
  export type IdempotencyKeyDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter which IdempotencyKey to delete.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey deleteMany
   */
  export type IdempotencyKeyDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which IdempotencyKeys to delete
     */
    where?: IdempotencyKeyWhereInput
    /**
     * Limit how many IdempotencyKeys to delete.
     */
    limit?: number
  }

  /**
   * IdempotencyKey without action
   */
  export type IdempotencyKeyDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
  }

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    id: number | null
    progress: number | null
    pendingDispatchCount: number | null
    pendingExecutionCount: number | null
    pendingAcceptanceCount: number | null
  }

  export type ProjectSumAggregateOutputType = {
    id: number | null
    progress: number | null
    pendingDispatchCount: number | null
    pendingExecutionCount: number | null
    pendingAcceptanceCount: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    status: string | null
    stage: string | null
    progress: number | null
    budget: string | null
    teamSize: string | null
    dateRange: string | null
    description: string | null
    owner: string | null
    riskLevel: string | null
    milestone: string | null
    tasks: string | null
    templateId: string | null
    dispatchStatus: string | null
    executionStatus: string | null
    acceptanceStatus: string | null
    settlementStatus: string | null
    pendingDispatchCount: number | null
    pendingExecutionCount: number | null
    pendingAcceptanceCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    status: string | null
    stage: string | null
    progress: number | null
    budget: string | null
    teamSize: string | null
    dateRange: string | null
    description: string | null
    owner: string | null
    riskLevel: string | null
    milestone: string | null
    tasks: string | null
    templateId: string | null
    dispatchStatus: string | null
    executionStatus: string | null
    acceptanceStatus: string | null
    settlementStatus: string | null
    pendingDispatchCount: number | null
    pendingExecutionCount: number | null
    pendingAcceptanceCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    code: number
    name: number
    status: number
    stage: number
    progress: number
    budget: number
    teamSize: number
    dateRange: number
    description: number
    owner: number
    riskLevel: number
    milestone: number
    tasks: number
    templateId: number
    dispatchStatus: number
    executionStatus: number
    acceptanceStatus: number
    settlementStatus: number
    pendingDispatchCount: number
    pendingExecutionCount: number
    pendingAcceptanceCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type ProjectAvgAggregateInputType = {
    id?: true
    progress?: true
    pendingDispatchCount?: true
    pendingExecutionCount?: true
    pendingAcceptanceCount?: true
  }

  export type ProjectSumAggregateInputType = {
    id?: true
    progress?: true
    pendingDispatchCount?: true
    pendingExecutionCount?: true
    pendingAcceptanceCount?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    status?: true
    stage?: true
    progress?: true
    budget?: true
    teamSize?: true
    dateRange?: true
    description?: true
    owner?: true
    riskLevel?: true
    milestone?: true
    tasks?: true
    templateId?: true
    dispatchStatus?: true
    executionStatus?: true
    acceptanceStatus?: true
    settlementStatus?: true
    pendingDispatchCount?: true
    pendingExecutionCount?: true
    pendingAcceptanceCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    status?: true
    stage?: true
    progress?: true
    budget?: true
    teamSize?: true
    dateRange?: true
    description?: true
    owner?: true
    riskLevel?: true
    milestone?: true
    tasks?: true
    templateId?: true
    dispatchStatus?: true
    executionStatus?: true
    acceptanceStatus?: true
    settlementStatus?: true
    pendingDispatchCount?: true
    pendingExecutionCount?: true
    pendingAcceptanceCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    status?: true
    stage?: true
    progress?: true
    budget?: true
    teamSize?: true
    dateRange?: true
    description?: true
    owner?: true
    riskLevel?: true
    milestone?: true
    tasks?: true
    templateId?: true
    dispatchStatus?: true
    executionStatus?: true
    acceptanceStatus?: true
    settlementStatus?: true
    pendingDispatchCount?: true
    pendingExecutionCount?: true
    pendingAcceptanceCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Projects
     **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
    [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }

  export type ProjectGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: number
    code: string
    name: string
    status: string
    stage: string
    progress: number
    budget: string | null
    teamSize: string | null
    dateRange: string | null
    description: string | null
    owner: string | null
    riskLevel: string | null
    milestone: string | null
    tasks: string | null
    templateId: string | null
    dispatchStatus: string | null
    executionStatus: string | null
    acceptanceStatus: string | null
    settlementStatus: string | null
    pendingDispatchCount: number
    pendingExecutionCount: number
    pendingAcceptanceCount: number
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProjectGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
          : GetScalarType<T[P], ProjectGroupByOutputType[P]>
      }
    >
  >

  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        code?: boolean
        name?: boolean
        status?: boolean
        stage?: boolean
        progress?: boolean
        budget?: boolean
        teamSize?: boolean
        dateRange?: boolean
        description?: boolean
        owner?: boolean
        riskLevel?: boolean
        milestone?: boolean
        tasks?: boolean
        templateId?: boolean
        dispatchStatus?: boolean
        executionStatus?: boolean
        acceptanceStatus?: boolean
        settlementStatus?: boolean
        pendingDispatchCount?: boolean
        pendingExecutionCount?: boolean
        pendingAcceptanceCount?: boolean
        createdAt?: boolean
        updatedAt?: boolean
        phases?: boolean | Project$phasesArgs<ExtArgs>
        milestones?: boolean | Project$milestonesArgs<ExtArgs>
        taskTree?: boolean | Project$taskTreeArgs<ExtArgs>
        risks?: boolean | Project$risksArgs<ExtArgs>
        members?: boolean | Project$membersArgs<ExtArgs>
        statusLogs?: boolean | Project$statusLogsArgs<ExtArgs>
        _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['project']
    >

  export type ProjectSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      code?: boolean
      name?: boolean
      status?: boolean
      stage?: boolean
      progress?: boolean
      budget?: boolean
      teamSize?: boolean
      dateRange?: boolean
      description?: boolean
      owner?: boolean
      riskLevel?: boolean
      milestone?: boolean
      tasks?: boolean
      templateId?: boolean
      dispatchStatus?: boolean
      executionStatus?: boolean
      acceptanceStatus?: boolean
      settlementStatus?: boolean
      pendingDispatchCount?: boolean
      pendingExecutionCount?: boolean
      pendingAcceptanceCount?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['project']
  >

  export type ProjectSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      code?: boolean
      name?: boolean
      status?: boolean
      stage?: boolean
      progress?: boolean
      budget?: boolean
      teamSize?: boolean
      dateRange?: boolean
      description?: boolean
      owner?: boolean
      riskLevel?: boolean
      milestone?: boolean
      tasks?: boolean
      templateId?: boolean
      dispatchStatus?: boolean
      executionStatus?: boolean
      acceptanceStatus?: boolean
      settlementStatus?: boolean
      pendingDispatchCount?: boolean
      pendingExecutionCount?: boolean
      pendingAcceptanceCount?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['project']
  >

  export type ProjectSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    status?: boolean
    stage?: boolean
    progress?: boolean
    budget?: boolean
    teamSize?: boolean
    dateRange?: boolean
    description?: boolean
    owner?: boolean
    riskLevel?: boolean
    milestone?: boolean
    tasks?: boolean
    templateId?: boolean
    dispatchStatus?: boolean
    executionStatus?: boolean
    acceptanceStatus?: boolean
    settlementStatus?: boolean
    pendingDispatchCount?: boolean
    pendingExecutionCount?: boolean
    pendingAcceptanceCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'code'
      | 'name'
      | 'status'
      | 'stage'
      | 'progress'
      | 'budget'
      | 'teamSize'
      | 'dateRange'
      | 'description'
      | 'owner'
      | 'riskLevel'
      | 'milestone'
      | 'tasks'
      | 'templateId'
      | 'dispatchStatus'
      | 'executionStatus'
      | 'acceptanceStatus'
      | 'settlementStatus'
      | 'pendingDispatchCount'
      | 'pendingExecutionCount'
      | 'pendingAcceptanceCount'
      | 'createdAt'
      | 'updatedAt',
      ExtArgs['result']['project']
    >
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    phases?: boolean | Project$phasesArgs<ExtArgs>
    milestones?: boolean | Project$milestonesArgs<ExtArgs>
    taskTree?: boolean | Project$taskTreeArgs<ExtArgs>
    risks?: boolean | Project$risksArgs<ExtArgs>
    members?: boolean | Project$membersArgs<ExtArgs>
    statusLogs?: boolean | Project$statusLogsArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}
  export type ProjectIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Project'
      objects: {
        phases: Prisma.$ProjectPhasePayload<ExtArgs>[]
        milestones: Prisma.$ProjectMilestonePayload<ExtArgs>[]
        taskTree: Prisma.$ProjectTaskPayload<ExtArgs>[]
        risks: Prisma.$ProjectRiskPayload<ExtArgs>[]
        members: Prisma.$ProjectMemberPayload<ExtArgs>[]
        statusLogs: Prisma.$ProjectStatusLogPayload<ExtArgs>[]
      }
      scalars: $Extensions.GetPayloadResult<
        {
          id: number
          code: string
          name: string
          status: string
          stage: string
          progress: number
          budget: string | null
          teamSize: string | null
          dateRange: string | null
          description: string | null
          owner: string | null
          riskLevel: string | null
          milestone: string | null
          tasks: string | null
          templateId: string | null
          dispatchStatus: string | null
          executionStatus: string | null
          acceptanceStatus: string | null
          settlementStatus: string | null
          pendingDispatchCount: number
          pendingExecutionCount: number
          pendingAcceptanceCount: number
          createdAt: Date
          updatedAt: Date
        },
        ExtArgs['result']['project']
      >
      composites: {}
    }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> =
    $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    ProjectFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: ProjectCountAggregateInputType | true
  }

  export interface ProjectDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project']; meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(
      args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(
      args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     *
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectFindManyArgs>(
      args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     *
     */
    create<T extends ProjectCreateArgs>(
      args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectCreateManyArgs>(
      args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     *
     */
    delete<T extends ProjectDeleteArgs>(
      args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectUpdateArgs>(
      args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectDeleteManyArgs>(
      args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectUpdateManyArgs>(
      args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(
      args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      $Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
     **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectAggregateArgs>(
      args: Subset<T, ProjectAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Project model
     */
    readonly fields: ProjectFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    phases<T extends Project$phasesArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$phasesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ProjectPhasePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    milestones<T extends Project$milestonesArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$milestonesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ProjectMilestonePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >
    taskTree<T extends Project$taskTreeArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$taskTreeArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    risks<T extends Project$risksArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$risksArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ProjectRiskPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    members<T extends Project$membersArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$membersArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      | Null
    >
    statusLogs<T extends Project$statusLogsArgs<ExtArgs> = {}>(
      args?: Subset<T, Project$statusLogsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ProjectStatusLogPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<'Project', 'Int'>
    readonly code: FieldRef<'Project', 'String'>
    readonly name: FieldRef<'Project', 'String'>
    readonly status: FieldRef<'Project', 'String'>
    readonly stage: FieldRef<'Project', 'String'>
    readonly progress: FieldRef<'Project', 'Int'>
    readonly budget: FieldRef<'Project', 'String'>
    readonly teamSize: FieldRef<'Project', 'String'>
    readonly dateRange: FieldRef<'Project', 'String'>
    readonly description: FieldRef<'Project', 'String'>
    readonly owner: FieldRef<'Project', 'String'>
    readonly riskLevel: FieldRef<'Project', 'String'>
    readonly milestone: FieldRef<'Project', 'String'>
    readonly tasks: FieldRef<'Project', 'String'>
    readonly templateId: FieldRef<'Project', 'String'>
    readonly dispatchStatus: FieldRef<'Project', 'String'>
    readonly executionStatus: FieldRef<'Project', 'String'>
    readonly acceptanceStatus: FieldRef<'Project', 'String'>
    readonly settlementStatus: FieldRef<'Project', 'String'>
    readonly pendingDispatchCount: FieldRef<'Project', 'Int'>
    readonly pendingExecutionCount: FieldRef<'Project', 'Int'>
    readonly pendingAcceptanceCount: FieldRef<'Project', 'Int'>
    readonly createdAt: FieldRef<'Project', 'DateTime'>
    readonly updatedAt: FieldRef<'Project', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.phases
   */
  export type Project$phasesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    where?: ProjectPhaseWhereInput
    orderBy?: ProjectPhaseOrderByWithRelationInput | ProjectPhaseOrderByWithRelationInput[]
    cursor?: ProjectPhaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectPhaseScalarFieldEnum | ProjectPhaseScalarFieldEnum[]
  }

  /**
   * Project.milestones
   */
  export type Project$milestonesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    where?: ProjectMilestoneWhereInput
    orderBy?: ProjectMilestoneOrderByWithRelationInput | ProjectMilestoneOrderByWithRelationInput[]
    cursor?: ProjectMilestoneWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectMilestoneScalarFieldEnum | ProjectMilestoneScalarFieldEnum[]
  }

  /**
   * Project.taskTree
   */
  export type Project$taskTreeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    where?: ProjectTaskWhereInput
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    cursor?: ProjectTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * Project.risks
   */
  export type Project$risksArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    where?: ProjectRiskWhereInput
    orderBy?: ProjectRiskOrderByWithRelationInput | ProjectRiskOrderByWithRelationInput[]
    cursor?: ProjectRiskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectRiskScalarFieldEnum | ProjectRiskScalarFieldEnum[]
  }

  /**
   * Project.members
   */
  export type Project$membersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    cursor?: ProjectMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * Project.statusLogs
   */
  export type Project$statusLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    where?: ProjectStatusLogWhereInput
    orderBy?: ProjectStatusLogOrderByWithRelationInput | ProjectStatusLogOrderByWithRelationInput[]
    cursor?: ProjectStatusLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectStatusLogScalarFieldEnum | ProjectStatusLogScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }

  /**
   * Model ProjectPhase
   */

  export type AggregateProjectPhase = {
    _count: ProjectPhaseCountAggregateOutputType | null
    _avg: ProjectPhaseAvgAggregateOutputType | null
    _sum: ProjectPhaseSumAggregateOutputType | null
    _min: ProjectPhaseMinAggregateOutputType | null
    _max: ProjectPhaseMaxAggregateOutputType | null
  }

  export type ProjectPhaseAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
    progress: number | null
  }

  export type ProjectPhaseSumAggregateOutputType = {
    id: number | null
    projectId: number | null
    progress: number | null
  }

  export type ProjectPhaseMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    name: string | null
    startDate: string | null
    endDate: string | null
    progress: number | null
    status: string | null
  }

  export type ProjectPhaseMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    name: string | null
    startDate: string | null
    endDate: string | null
    progress: number | null
    status: string | null
  }

  export type ProjectPhaseCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    startDate: number
    endDate: number
    progress: number
    status: number
    _all: number
  }

  export type ProjectPhaseAvgAggregateInputType = {
    id?: true
    projectId?: true
    progress?: true
  }

  export type ProjectPhaseSumAggregateInputType = {
    id?: true
    projectId?: true
    progress?: true
  }

  export type ProjectPhaseMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    startDate?: true
    endDate?: true
    progress?: true
    status?: true
  }

  export type ProjectPhaseMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    startDate?: true
    endDate?: true
    progress?: true
    status?: true
  }

  export type ProjectPhaseCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    startDate?: true
    endDate?: true
    progress?: true
    status?: true
    _all?: true
  }

  export type ProjectPhaseAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectPhase to aggregate.
     */
    where?: ProjectPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectPhases to fetch.
     */
    orderBy?: ProjectPhaseOrderByWithRelationInput | ProjectPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectPhases
     **/
    _count?: true | ProjectPhaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectPhaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectPhaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectPhaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectPhaseMaxAggregateInputType
  }

  export type GetProjectPhaseAggregateType<T extends ProjectPhaseAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectPhase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectPhase[P]>
      : GetScalarType<T[P], AggregateProjectPhase[P]>
  }

  export type ProjectPhaseGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectPhaseWhereInput
    orderBy?: ProjectPhaseOrderByWithAggregationInput | ProjectPhaseOrderByWithAggregationInput[]
    by: ProjectPhaseScalarFieldEnum[] | ProjectPhaseScalarFieldEnum
    having?: ProjectPhaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectPhaseCountAggregateInputType | true
    _avg?: ProjectPhaseAvgAggregateInputType
    _sum?: ProjectPhaseSumAggregateInputType
    _min?: ProjectPhaseMinAggregateInputType
    _max?: ProjectPhaseMaxAggregateInputType
  }

  export type ProjectPhaseGroupByOutputType = {
    id: number
    projectId: number
    name: string
    startDate: string
    endDate: string
    progress: number
    status: string
    _count: ProjectPhaseCountAggregateOutputType | null
    _avg: ProjectPhaseAvgAggregateOutputType | null
    _sum: ProjectPhaseSumAggregateOutputType | null
    _min: ProjectPhaseMinAggregateOutputType | null
    _max: ProjectPhaseMaxAggregateOutputType | null
  }

  type GetProjectPhaseGroupByPayload<T extends ProjectPhaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectPhaseGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProjectPhaseGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProjectPhaseGroupByOutputType[P]>
          : GetScalarType<T[P], ProjectPhaseGroupByOutputType[P]>
      }
    >
  >

  export type ProjectPhaseSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      name?: boolean
      startDate?: boolean
      endDate?: boolean
      progress?: boolean
      status?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectPhase']
  >

  export type ProjectPhaseSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      name?: boolean
      startDate?: boolean
      endDate?: boolean
      progress?: boolean
      status?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectPhase']
  >

  export type ProjectPhaseSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      name?: boolean
      startDate?: boolean
      endDate?: boolean
      progress?: boolean
      status?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectPhase']
  >

  export type ProjectPhaseSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    startDate?: boolean
    endDate?: boolean
    progress?: boolean
    status?: boolean
  }

  export type ProjectPhaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'projectId' | 'name' | 'startDate' | 'endDate' | 'progress' | 'status',
      ExtArgs['result']['projectPhase']
    >
  export type ProjectPhaseInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectPhaseIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectPhaseIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectPhasePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectPhase'
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        projectId: number
        name: string
        startDate: string
        endDate: string
        progress: number
        status: string
      },
      ExtArgs['result']['projectPhase']
    >
    composites: {}
  }

  type ProjectPhaseGetPayload<S extends boolean | null | undefined | ProjectPhaseDefaultArgs> =
    $Result.GetResult<Prisma.$ProjectPhasePayload, S>

  type ProjectPhaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectPhaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectPhaseCountAggregateInputType | true
    }

  export interface ProjectPhaseDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectPhase']
      meta: { name: 'ProjectPhase' }
    }
    /**
     * Find zero or one ProjectPhase that matches the filter.
     * @param {ProjectPhaseFindUniqueArgs} args - Arguments to find a ProjectPhase
     * @example
     * // Get one ProjectPhase
     * const projectPhase = await prisma.projectPhase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectPhaseFindUniqueArgs>(
      args: SelectSubset<T, ProjectPhaseFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<
        Prisma.$ProjectPhasePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectPhase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectPhaseFindUniqueOrThrowArgs} args - Arguments to find a ProjectPhase
     * @example
     * // Get one ProjectPhase
     * const projectPhase = await prisma.projectPhase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectPhaseFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectPhaseFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<
        Prisma.$ProjectPhasePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectPhase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseFindFirstArgs} args - Arguments to find a ProjectPhase
     * @example
     * // Get one ProjectPhase
     * const projectPhase = await prisma.projectPhase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectPhaseFindFirstArgs>(
      args?: SelectSubset<T, ProjectPhaseFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<
        Prisma.$ProjectPhasePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectPhase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseFindFirstOrThrowArgs} args - Arguments to find a ProjectPhase
     * @example
     * // Get one ProjectPhase
     * const projectPhase = await prisma.projectPhase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectPhaseFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectPhaseFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<
        Prisma.$ProjectPhasePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectPhases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectPhases
     * const projectPhases = await prisma.projectPhase.findMany()
     *
     * // Get first 10 ProjectPhases
     * const projectPhases = await prisma.projectPhase.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectPhaseWithIdOnly = await prisma.projectPhase.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectPhaseFindManyArgs>(
      args?: SelectSubset<T, ProjectPhaseFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectPhasePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectPhase.
     * @param {ProjectPhaseCreateArgs} args - Arguments to create a ProjectPhase.
     * @example
     * // Create one ProjectPhase
     * const ProjectPhase = await prisma.projectPhase.create({
     *   data: {
     *     // ... data to create a ProjectPhase
     *   }
     * })
     *
     */
    create<T extends ProjectPhaseCreateArgs>(
      args: SelectSubset<T, ProjectPhaseCreateArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<Prisma.$ProjectPhasePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectPhases.
     * @param {ProjectPhaseCreateManyArgs} args - Arguments to create many ProjectPhases.
     * @example
     * // Create many ProjectPhases
     * const projectPhase = await prisma.projectPhase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectPhaseCreateManyArgs>(
      args?: SelectSubset<T, ProjectPhaseCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectPhases and returns the data saved in the database.
     * @param {ProjectPhaseCreateManyAndReturnArgs} args - Arguments to create many ProjectPhases.
     * @example
     * // Create many ProjectPhases
     * const projectPhase = await prisma.projectPhase.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectPhases and only return the `id`
     * const projectPhaseWithIdOnly = await prisma.projectPhase.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectPhaseCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectPhaseCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectPhasePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectPhase.
     * @param {ProjectPhaseDeleteArgs} args - Arguments to delete one ProjectPhase.
     * @example
     * // Delete one ProjectPhase
     * const ProjectPhase = await prisma.projectPhase.delete({
     *   where: {
     *     // ... filter to delete one ProjectPhase
     *   }
     * })
     *
     */
    delete<T extends ProjectPhaseDeleteArgs>(
      args: SelectSubset<T, ProjectPhaseDeleteArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<Prisma.$ProjectPhasePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectPhase.
     * @param {ProjectPhaseUpdateArgs} args - Arguments to update one ProjectPhase.
     * @example
     * // Update one ProjectPhase
     * const projectPhase = await prisma.projectPhase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectPhaseUpdateArgs>(
      args: SelectSubset<T, ProjectPhaseUpdateArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<Prisma.$ProjectPhasePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectPhases.
     * @param {ProjectPhaseDeleteManyArgs} args - Arguments to filter ProjectPhases to delete.
     * @example
     * // Delete a few ProjectPhases
     * const { count } = await prisma.projectPhase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectPhaseDeleteManyArgs>(
      args?: SelectSubset<T, ProjectPhaseDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectPhases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectPhases
     * const projectPhase = await prisma.projectPhase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectPhaseUpdateManyArgs>(
      args: SelectSubset<T, ProjectPhaseUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectPhases and returns the data updated in the database.
     * @param {ProjectPhaseUpdateManyAndReturnArgs} args - Arguments to update many ProjectPhases.
     * @example
     * // Update many ProjectPhases
     * const projectPhase = await prisma.projectPhase.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectPhases and only return the `id`
     * const projectPhaseWithIdOnly = await prisma.projectPhase.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectPhaseUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectPhaseUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectPhasePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectPhase.
     * @param {ProjectPhaseUpsertArgs} args - Arguments to update or create a ProjectPhase.
     * @example
     * // Update or create a ProjectPhase
     * const projectPhase = await prisma.projectPhase.upsert({
     *   create: {
     *     // ... data to create a ProjectPhase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectPhase we want to update
     *   }
     * })
     */
    upsert<T extends ProjectPhaseUpsertArgs>(
      args: SelectSubset<T, ProjectPhaseUpsertArgs<ExtArgs>>
    ): Prisma__ProjectPhaseClient<
      $Result.GetResult<Prisma.$ProjectPhasePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectPhases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseCountArgs} args - Arguments to filter ProjectPhases to count.
     * @example
     * // Count the number of ProjectPhases
     * const count = await prisma.projectPhase.count({
     *   where: {
     *     // ... the filter for the ProjectPhases we want to count
     *   }
     * })
     **/
    count<T extends ProjectPhaseCountArgs>(
      args?: Subset<T, ProjectPhaseCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectPhaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectPhase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectPhaseAggregateArgs>(
      args: Subset<T, ProjectPhaseAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectPhaseAggregateType<T>>

    /**
     * Group by ProjectPhase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPhaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectPhaseGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectPhaseGroupByArgs['orderBy'] }
        : { orderBy?: ProjectPhaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectPhaseGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProjectPhaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectPhase model
     */
    readonly fields: ProjectPhaseFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectPhase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectPhaseClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectPhase model
   */
  interface ProjectPhaseFieldRefs {
    readonly id: FieldRef<'ProjectPhase', 'Int'>
    readonly projectId: FieldRef<'ProjectPhase', 'Int'>
    readonly name: FieldRef<'ProjectPhase', 'String'>
    readonly startDate: FieldRef<'ProjectPhase', 'String'>
    readonly endDate: FieldRef<'ProjectPhase', 'String'>
    readonly progress: FieldRef<'ProjectPhase', 'Int'>
    readonly status: FieldRef<'ProjectPhase', 'String'>
  }

  // Custom InputTypes
  /**
   * ProjectPhase findUnique
   */
  export type ProjectPhaseFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPhase to fetch.
     */
    where: ProjectPhaseWhereUniqueInput
  }

  /**
   * ProjectPhase findUniqueOrThrow
   */
  export type ProjectPhaseFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPhase to fetch.
     */
    where: ProjectPhaseWhereUniqueInput
  }

  /**
   * ProjectPhase findFirst
   */
  export type ProjectPhaseFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPhase to fetch.
     */
    where?: ProjectPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectPhases to fetch.
     */
    orderBy?: ProjectPhaseOrderByWithRelationInput | ProjectPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectPhases.
     */
    cursor?: ProjectPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectPhases.
     */
    distinct?: ProjectPhaseScalarFieldEnum | ProjectPhaseScalarFieldEnum[]
  }

  /**
   * ProjectPhase findFirstOrThrow
   */
  export type ProjectPhaseFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPhase to fetch.
     */
    where?: ProjectPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectPhases to fetch.
     */
    orderBy?: ProjectPhaseOrderByWithRelationInput | ProjectPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectPhases.
     */
    cursor?: ProjectPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectPhases.
     */
    distinct?: ProjectPhaseScalarFieldEnum | ProjectPhaseScalarFieldEnum[]
  }

  /**
   * ProjectPhase findMany
   */
  export type ProjectPhaseFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPhases to fetch.
     */
    where?: ProjectPhaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectPhases to fetch.
     */
    orderBy?: ProjectPhaseOrderByWithRelationInput | ProjectPhaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectPhases.
     */
    cursor?: ProjectPhaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectPhases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectPhases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectPhases.
     */
    distinct?: ProjectPhaseScalarFieldEnum | ProjectPhaseScalarFieldEnum[]
  }

  /**
   * ProjectPhase create
   */
  export type ProjectPhaseCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectPhase.
     */
    data: XOR<ProjectPhaseCreateInput, ProjectPhaseUncheckedCreateInput>
  }

  /**
   * ProjectPhase createMany
   */
  export type ProjectPhaseCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectPhases.
     */
    data: ProjectPhaseCreateManyInput | ProjectPhaseCreateManyInput[]
  }

  /**
   * ProjectPhase createManyAndReturn
   */
  export type ProjectPhaseCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectPhases.
     */
    data: ProjectPhaseCreateManyInput | ProjectPhaseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectPhase update
   */
  export type ProjectPhaseUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectPhase.
     */
    data: XOR<ProjectPhaseUpdateInput, ProjectPhaseUncheckedUpdateInput>
    /**
     * Choose, which ProjectPhase to update.
     */
    where: ProjectPhaseWhereUniqueInput
  }

  /**
   * ProjectPhase updateMany
   */
  export type ProjectPhaseUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectPhases.
     */
    data: XOR<ProjectPhaseUpdateManyMutationInput, ProjectPhaseUncheckedUpdateManyInput>
    /**
     * Filter which ProjectPhases to update
     */
    where?: ProjectPhaseWhereInput
    /**
     * Limit how many ProjectPhases to update.
     */
    limit?: number
  }

  /**
   * ProjectPhase updateManyAndReturn
   */
  export type ProjectPhaseUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * The data used to update ProjectPhases.
     */
    data: XOR<ProjectPhaseUpdateManyMutationInput, ProjectPhaseUncheckedUpdateManyInput>
    /**
     * Filter which ProjectPhases to update
     */
    where?: ProjectPhaseWhereInput
    /**
     * Limit how many ProjectPhases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectPhase upsert
   */
  export type ProjectPhaseUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectPhase to update in case it exists.
     */
    where: ProjectPhaseWhereUniqueInput
    /**
     * In case the ProjectPhase found by the `where` argument doesn't exist, create a new ProjectPhase with this data.
     */
    create: XOR<ProjectPhaseCreateInput, ProjectPhaseUncheckedCreateInput>
    /**
     * In case the ProjectPhase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectPhaseUpdateInput, ProjectPhaseUncheckedUpdateInput>
  }

  /**
   * ProjectPhase delete
   */
  export type ProjectPhaseDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
    /**
     * Filter which ProjectPhase to delete.
     */
    where: ProjectPhaseWhereUniqueInput
  }

  /**
   * ProjectPhase deleteMany
   */
  export type ProjectPhaseDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectPhases to delete
     */
    where?: ProjectPhaseWhereInput
    /**
     * Limit how many ProjectPhases to delete.
     */
    limit?: number
  }

  /**
   * ProjectPhase without action
   */
  export type ProjectPhaseDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectPhase
     */
    select?: ProjectPhaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPhase
     */
    omit?: ProjectPhaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPhaseInclude<ExtArgs> | null
  }

  /**
   * Model ProjectMilestone
   */

  export type AggregateProjectMilestone = {
    _count: ProjectMilestoneCountAggregateOutputType | null
    _avg: ProjectMilestoneAvgAggregateOutputType | null
    _sum: ProjectMilestoneSumAggregateOutputType | null
    _min: ProjectMilestoneMinAggregateOutputType | null
    _max: ProjectMilestoneMaxAggregateOutputType | null
  }

  export type ProjectMilestoneAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectMilestoneSumAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectMilestoneMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    name: string | null
    dueDate: string | null
    status: string | null
    assignee: string | null
    completedDate: string | null
  }

  export type ProjectMilestoneMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    name: string | null
    dueDate: string | null
    status: string | null
    assignee: string | null
    completedDate: string | null
  }

  export type ProjectMilestoneCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    dueDate: number
    status: number
    assignee: number
    completedDate: number
    _all: number
  }

  export type ProjectMilestoneAvgAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectMilestoneSumAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectMilestoneMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    dueDate?: true
    status?: true
    assignee?: true
    completedDate?: true
  }

  export type ProjectMilestoneMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    dueDate?: true
    status?: true
    assignee?: true
    completedDate?: true
  }

  export type ProjectMilestoneCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    dueDate?: true
    status?: true
    assignee?: true
    completedDate?: true
    _all?: true
  }

  export type ProjectMilestoneAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectMilestone to aggregate.
     */
    where?: ProjectMilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMilestones to fetch.
     */
    orderBy?: ProjectMilestoneOrderByWithRelationInput | ProjectMilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectMilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectMilestones
     **/
    _count?: true | ProjectMilestoneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectMilestoneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectMilestoneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectMilestoneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectMilestoneMaxAggregateInputType
  }

  export type GetProjectMilestoneAggregateType<T extends ProjectMilestoneAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectMilestone]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectMilestone[P]>
      : GetScalarType<T[P], AggregateProjectMilestone[P]>
  }

  export type ProjectMilestoneGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectMilestoneWhereInput
    orderBy?:
      | ProjectMilestoneOrderByWithAggregationInput
      | ProjectMilestoneOrderByWithAggregationInput[]
    by: ProjectMilestoneScalarFieldEnum[] | ProjectMilestoneScalarFieldEnum
    having?: ProjectMilestoneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectMilestoneCountAggregateInputType | true
    _avg?: ProjectMilestoneAvgAggregateInputType
    _sum?: ProjectMilestoneSumAggregateInputType
    _min?: ProjectMilestoneMinAggregateInputType
    _max?: ProjectMilestoneMaxAggregateInputType
  }

  export type ProjectMilestoneGroupByOutputType = {
    id: number
    projectId: number
    name: string
    dueDate: string
    status: string
    assignee: string | null
    completedDate: string | null
    _count: ProjectMilestoneCountAggregateOutputType | null
    _avg: ProjectMilestoneAvgAggregateOutputType | null
    _sum: ProjectMilestoneSumAggregateOutputType | null
    _min: ProjectMilestoneMinAggregateOutputType | null
    _max: ProjectMilestoneMaxAggregateOutputType | null
  }

  type GetProjectMilestoneGroupByPayload<T extends ProjectMilestoneGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProjectMilestoneGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProjectMilestoneGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectMilestoneGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectMilestoneGroupByOutputType[P]>
        }
      >
    >

  export type ProjectMilestoneSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      name?: boolean
      dueDate?: boolean
      status?: boolean
      assignee?: boolean
      completedDate?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectMilestone']
  >

  export type ProjectMilestoneSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      name?: boolean
      dueDate?: boolean
      status?: boolean
      assignee?: boolean
      completedDate?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectMilestone']
  >

  export type ProjectMilestoneSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      name?: boolean
      dueDate?: boolean
      status?: boolean
      assignee?: boolean
      completedDate?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectMilestone']
  >

  export type ProjectMilestoneSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    dueDate?: boolean
    status?: boolean
    assignee?: boolean
    completedDate?: boolean
  }

  export type ProjectMilestoneOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'projectId' | 'name' | 'dueDate' | 'status' | 'assignee' | 'completedDate',
    ExtArgs['result']['projectMilestone']
  >
  export type ProjectMilestoneInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMilestoneIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMilestoneIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectMilestonePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectMilestone'
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        projectId: number
        name: string
        dueDate: string
        status: string
        assignee: string | null
        completedDate: string | null
      },
      ExtArgs['result']['projectMilestone']
    >
    composites: {}
  }

  type ProjectMilestoneGetPayload<
    S extends boolean | null | undefined | ProjectMilestoneDefaultArgs,
  > = $Result.GetResult<Prisma.$ProjectMilestonePayload, S>

  type ProjectMilestoneCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProjectMilestoneFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectMilestoneCountAggregateInputType | true
  }

  export interface ProjectMilestoneDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectMilestone']
      meta: { name: 'ProjectMilestone' }
    }
    /**
     * Find zero or one ProjectMilestone that matches the filter.
     * @param {ProjectMilestoneFindUniqueArgs} args - Arguments to find a ProjectMilestone
     * @example
     * // Get one ProjectMilestone
     * const projectMilestone = await prisma.projectMilestone.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectMilestoneFindUniqueArgs>(
      args: SelectSubset<T, ProjectMilestoneFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<
        Prisma.$ProjectMilestonePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectMilestone that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectMilestoneFindUniqueOrThrowArgs} args - Arguments to find a ProjectMilestone
     * @example
     * // Get one ProjectMilestone
     * const projectMilestone = await prisma.projectMilestone.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectMilestoneFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectMilestoneFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<
        Prisma.$ProjectMilestonePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectMilestone that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneFindFirstArgs} args - Arguments to find a ProjectMilestone
     * @example
     * // Get one ProjectMilestone
     * const projectMilestone = await prisma.projectMilestone.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectMilestoneFindFirstArgs>(
      args?: SelectSubset<T, ProjectMilestoneFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<
        Prisma.$ProjectMilestonePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectMilestone that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneFindFirstOrThrowArgs} args - Arguments to find a ProjectMilestone
     * @example
     * // Get one ProjectMilestone
     * const projectMilestone = await prisma.projectMilestone.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectMilestoneFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectMilestoneFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<
        Prisma.$ProjectMilestonePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectMilestones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectMilestones
     * const projectMilestones = await prisma.projectMilestone.findMany()
     *
     * // Get first 10 ProjectMilestones
     * const projectMilestones = await prisma.projectMilestone.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectMilestoneWithIdOnly = await prisma.projectMilestone.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectMilestoneFindManyArgs>(
      args?: SelectSubset<T, ProjectMilestoneFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectMilestonePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectMilestone.
     * @param {ProjectMilestoneCreateArgs} args - Arguments to create a ProjectMilestone.
     * @example
     * // Create one ProjectMilestone
     * const ProjectMilestone = await prisma.projectMilestone.create({
     *   data: {
     *     // ... data to create a ProjectMilestone
     *   }
     * })
     *
     */
    create<T extends ProjectMilestoneCreateArgs>(
      args: SelectSubset<T, ProjectMilestoneCreateArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<Prisma.$ProjectMilestonePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectMilestones.
     * @param {ProjectMilestoneCreateManyArgs} args - Arguments to create many ProjectMilestones.
     * @example
     * // Create many ProjectMilestones
     * const projectMilestone = await prisma.projectMilestone.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectMilestoneCreateManyArgs>(
      args?: SelectSubset<T, ProjectMilestoneCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectMilestones and returns the data saved in the database.
     * @param {ProjectMilestoneCreateManyAndReturnArgs} args - Arguments to create many ProjectMilestones.
     * @example
     * // Create many ProjectMilestones
     * const projectMilestone = await prisma.projectMilestone.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectMilestones and only return the `id`
     * const projectMilestoneWithIdOnly = await prisma.projectMilestone.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectMilestoneCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectMilestoneCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectMilestonePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectMilestone.
     * @param {ProjectMilestoneDeleteArgs} args - Arguments to delete one ProjectMilestone.
     * @example
     * // Delete one ProjectMilestone
     * const ProjectMilestone = await prisma.projectMilestone.delete({
     *   where: {
     *     // ... filter to delete one ProjectMilestone
     *   }
     * })
     *
     */
    delete<T extends ProjectMilestoneDeleteArgs>(
      args: SelectSubset<T, ProjectMilestoneDeleteArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<Prisma.$ProjectMilestonePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectMilestone.
     * @param {ProjectMilestoneUpdateArgs} args - Arguments to update one ProjectMilestone.
     * @example
     * // Update one ProjectMilestone
     * const projectMilestone = await prisma.projectMilestone.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectMilestoneUpdateArgs>(
      args: SelectSubset<T, ProjectMilestoneUpdateArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<Prisma.$ProjectMilestonePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectMilestones.
     * @param {ProjectMilestoneDeleteManyArgs} args - Arguments to filter ProjectMilestones to delete.
     * @example
     * // Delete a few ProjectMilestones
     * const { count } = await prisma.projectMilestone.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectMilestoneDeleteManyArgs>(
      args?: SelectSubset<T, ProjectMilestoneDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMilestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectMilestones
     * const projectMilestone = await prisma.projectMilestone.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectMilestoneUpdateManyArgs>(
      args: SelectSubset<T, ProjectMilestoneUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMilestones and returns the data updated in the database.
     * @param {ProjectMilestoneUpdateManyAndReturnArgs} args - Arguments to update many ProjectMilestones.
     * @example
     * // Update many ProjectMilestones
     * const projectMilestone = await prisma.projectMilestone.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectMilestones and only return the `id`
     * const projectMilestoneWithIdOnly = await prisma.projectMilestone.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectMilestoneUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectMilestoneUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectMilestonePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectMilestone.
     * @param {ProjectMilestoneUpsertArgs} args - Arguments to update or create a ProjectMilestone.
     * @example
     * // Update or create a ProjectMilestone
     * const projectMilestone = await prisma.projectMilestone.upsert({
     *   create: {
     *     // ... data to create a ProjectMilestone
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectMilestone we want to update
     *   }
     * })
     */
    upsert<T extends ProjectMilestoneUpsertArgs>(
      args: SelectSubset<T, ProjectMilestoneUpsertArgs<ExtArgs>>
    ): Prisma__ProjectMilestoneClient<
      $Result.GetResult<Prisma.$ProjectMilestonePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectMilestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneCountArgs} args - Arguments to filter ProjectMilestones to count.
     * @example
     * // Count the number of ProjectMilestones
     * const count = await prisma.projectMilestone.count({
     *   where: {
     *     // ... the filter for the ProjectMilestones we want to count
     *   }
     * })
     **/
    count<T extends ProjectMilestoneCountArgs>(
      args?: Subset<T, ProjectMilestoneCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectMilestoneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectMilestone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectMilestoneAggregateArgs>(
      args: Subset<T, ProjectMilestoneAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectMilestoneAggregateType<T>>

    /**
     * Group by ProjectMilestone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMilestoneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectMilestoneGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectMilestoneGroupByArgs['orderBy'] }
        : { orderBy?: ProjectMilestoneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectMilestoneGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetProjectMilestoneGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectMilestone model
     */
    readonly fields: ProjectMilestoneFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectMilestone.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectMilestoneClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectMilestone model
   */
  interface ProjectMilestoneFieldRefs {
    readonly id: FieldRef<'ProjectMilestone', 'Int'>
    readonly projectId: FieldRef<'ProjectMilestone', 'Int'>
    readonly name: FieldRef<'ProjectMilestone', 'String'>
    readonly dueDate: FieldRef<'ProjectMilestone', 'String'>
    readonly status: FieldRef<'ProjectMilestone', 'String'>
    readonly assignee: FieldRef<'ProjectMilestone', 'String'>
    readonly completedDate: FieldRef<'ProjectMilestone', 'String'>
  }

  // Custom InputTypes
  /**
   * ProjectMilestone findUnique
   */
  export type ProjectMilestoneFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMilestone to fetch.
     */
    where: ProjectMilestoneWhereUniqueInput
  }

  /**
   * ProjectMilestone findUniqueOrThrow
   */
  export type ProjectMilestoneFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMilestone to fetch.
     */
    where: ProjectMilestoneWhereUniqueInput
  }

  /**
   * ProjectMilestone findFirst
   */
  export type ProjectMilestoneFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMilestone to fetch.
     */
    where?: ProjectMilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMilestones to fetch.
     */
    orderBy?: ProjectMilestoneOrderByWithRelationInput | ProjectMilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectMilestones.
     */
    cursor?: ProjectMilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectMilestones.
     */
    distinct?: ProjectMilestoneScalarFieldEnum | ProjectMilestoneScalarFieldEnum[]
  }

  /**
   * ProjectMilestone findFirstOrThrow
   */
  export type ProjectMilestoneFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMilestone to fetch.
     */
    where?: ProjectMilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMilestones to fetch.
     */
    orderBy?: ProjectMilestoneOrderByWithRelationInput | ProjectMilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectMilestones.
     */
    cursor?: ProjectMilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectMilestones.
     */
    distinct?: ProjectMilestoneScalarFieldEnum | ProjectMilestoneScalarFieldEnum[]
  }

  /**
   * ProjectMilestone findMany
   */
  export type ProjectMilestoneFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMilestones to fetch.
     */
    where?: ProjectMilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMilestones to fetch.
     */
    orderBy?: ProjectMilestoneOrderByWithRelationInput | ProjectMilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectMilestones.
     */
    cursor?: ProjectMilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMilestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMilestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectMilestones.
     */
    distinct?: ProjectMilestoneScalarFieldEnum | ProjectMilestoneScalarFieldEnum[]
  }

  /**
   * ProjectMilestone create
   */
  export type ProjectMilestoneCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectMilestone.
     */
    data: XOR<ProjectMilestoneCreateInput, ProjectMilestoneUncheckedCreateInput>
  }

  /**
   * ProjectMilestone createMany
   */
  export type ProjectMilestoneCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectMilestones.
     */
    data: ProjectMilestoneCreateManyInput | ProjectMilestoneCreateManyInput[]
  }

  /**
   * ProjectMilestone createManyAndReturn
   */
  export type ProjectMilestoneCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectMilestones.
     */
    data: ProjectMilestoneCreateManyInput | ProjectMilestoneCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMilestone update
   */
  export type ProjectMilestoneUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectMilestone.
     */
    data: XOR<ProjectMilestoneUpdateInput, ProjectMilestoneUncheckedUpdateInput>
    /**
     * Choose, which ProjectMilestone to update.
     */
    where: ProjectMilestoneWhereUniqueInput
  }

  /**
   * ProjectMilestone updateMany
   */
  export type ProjectMilestoneUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectMilestones.
     */
    data: XOR<ProjectMilestoneUpdateManyMutationInput, ProjectMilestoneUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMilestones to update
     */
    where?: ProjectMilestoneWhereInput
    /**
     * Limit how many ProjectMilestones to update.
     */
    limit?: number
  }

  /**
   * ProjectMilestone updateManyAndReturn
   */
  export type ProjectMilestoneUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * The data used to update ProjectMilestones.
     */
    data: XOR<ProjectMilestoneUpdateManyMutationInput, ProjectMilestoneUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMilestones to update
     */
    where?: ProjectMilestoneWhereInput
    /**
     * Limit how many ProjectMilestones to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMilestone upsert
   */
  export type ProjectMilestoneUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectMilestone to update in case it exists.
     */
    where: ProjectMilestoneWhereUniqueInput
    /**
     * In case the ProjectMilestone found by the `where` argument doesn't exist, create a new ProjectMilestone with this data.
     */
    create: XOR<ProjectMilestoneCreateInput, ProjectMilestoneUncheckedCreateInput>
    /**
     * In case the ProjectMilestone was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectMilestoneUpdateInput, ProjectMilestoneUncheckedUpdateInput>
  }

  /**
   * ProjectMilestone delete
   */
  export type ProjectMilestoneDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
    /**
     * Filter which ProjectMilestone to delete.
     */
    where: ProjectMilestoneWhereUniqueInput
  }

  /**
   * ProjectMilestone deleteMany
   */
  export type ProjectMilestoneDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectMilestones to delete
     */
    where?: ProjectMilestoneWhereInput
    /**
     * Limit how many ProjectMilestones to delete.
     */
    limit?: number
  }

  /**
   * ProjectMilestone without action
   */
  export type ProjectMilestoneDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMilestone
     */
    select?: ProjectMilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMilestone
     */
    omit?: ProjectMilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMilestoneInclude<ExtArgs> | null
  }

  /**
   * Model ProjectTask
   */

  export type AggregateProjectTask = {
    _count: ProjectTaskCountAggregateOutputType | null
    _avg: ProjectTaskAvgAggregateOutputType | null
    _sum: ProjectTaskSumAggregateOutputType | null
    _min: ProjectTaskMinAggregateOutputType | null
    _max: ProjectTaskMaxAggregateOutputType | null
  }

  export type ProjectTaskAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
    progress: number | null
    parentId: number | null
  }

  export type ProjectTaskSumAggregateOutputType = {
    id: number | null
    projectId: number | null
    progress: number | null
    parentId: number | null
  }

  export type ProjectTaskMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    code: string | null
    name: string | null
    status: string | null
    assignee: string | null
    startDate: string | null
    endDate: string | null
    progress: number | null
    parentId: number | null
  }

  export type ProjectTaskMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    code: string | null
    name: string | null
    status: string | null
    assignee: string | null
    startDate: string | null
    endDate: string | null
    progress: number | null
    parentId: number | null
  }

  export type ProjectTaskCountAggregateOutputType = {
    id: number
    projectId: number
    code: number
    name: number
    status: number
    assignee: number
    startDate: number
    endDate: number
    progress: number
    parentId: number
    _all: number
  }

  export type ProjectTaskAvgAggregateInputType = {
    id?: true
    projectId?: true
    progress?: true
    parentId?: true
  }

  export type ProjectTaskSumAggregateInputType = {
    id?: true
    projectId?: true
    progress?: true
    parentId?: true
  }

  export type ProjectTaskMinAggregateInputType = {
    id?: true
    projectId?: true
    code?: true
    name?: true
    status?: true
    assignee?: true
    startDate?: true
    endDate?: true
    progress?: true
    parentId?: true
  }

  export type ProjectTaskMaxAggregateInputType = {
    id?: true
    projectId?: true
    code?: true
    name?: true
    status?: true
    assignee?: true
    startDate?: true
    endDate?: true
    progress?: true
    parentId?: true
  }

  export type ProjectTaskCountAggregateInputType = {
    id?: true
    projectId?: true
    code?: true
    name?: true
    status?: true
    assignee?: true
    startDate?: true
    endDate?: true
    progress?: true
    parentId?: true
    _all?: true
  }

  export type ProjectTaskAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectTask to aggregate.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectTasks
     **/
    _count?: true | ProjectTaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectTaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectTaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectTaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectTaskMaxAggregateInputType
  }

  export type GetProjectTaskAggregateType<T extends ProjectTaskAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectTask[P]>
      : GetScalarType<T[P], AggregateProjectTask[P]>
  }

  export type ProjectTaskGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectTaskWhereInput
    orderBy?: ProjectTaskOrderByWithAggregationInput | ProjectTaskOrderByWithAggregationInput[]
    by: ProjectTaskScalarFieldEnum[] | ProjectTaskScalarFieldEnum
    having?: ProjectTaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectTaskCountAggregateInputType | true
    _avg?: ProjectTaskAvgAggregateInputType
    _sum?: ProjectTaskSumAggregateInputType
    _min?: ProjectTaskMinAggregateInputType
    _max?: ProjectTaskMaxAggregateInputType
  }

  export type ProjectTaskGroupByOutputType = {
    id: number
    projectId: number
    code: string
    name: string
    status: string
    assignee: string | null
    startDate: string | null
    endDate: string | null
    progress: number
    parentId: number | null
    _count: ProjectTaskCountAggregateOutputType | null
    _avg: ProjectTaskAvgAggregateOutputType | null
    _sum: ProjectTaskSumAggregateOutputType | null
    _min: ProjectTaskMinAggregateOutputType | null
    _max: ProjectTaskMaxAggregateOutputType | null
  }

  type GetProjectTaskGroupByPayload<T extends ProjectTaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectTaskGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProjectTaskGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProjectTaskGroupByOutputType[P]>
          : GetScalarType<T[P], ProjectTaskGroupByOutputType[P]>
      }
    >
  >

  export type ProjectTaskSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      code?: boolean
      name?: boolean
      status?: boolean
      assignee?: boolean
      startDate?: boolean
      endDate?: boolean
      progress?: boolean
      parentId?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectTask']
  >

  export type ProjectTaskSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      code?: boolean
      name?: boolean
      status?: boolean
      assignee?: boolean
      startDate?: boolean
      endDate?: boolean
      progress?: boolean
      parentId?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectTask']
  >

  export type ProjectTaskSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      code?: boolean
      name?: boolean
      status?: boolean
      assignee?: boolean
      startDate?: boolean
      endDate?: boolean
      progress?: boolean
      parentId?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectTask']
  >

  export type ProjectTaskSelectScalar = {
    id?: boolean
    projectId?: boolean
    code?: boolean
    name?: boolean
    status?: boolean
    assignee?: boolean
    startDate?: boolean
    endDate?: boolean
    progress?: boolean
    parentId?: boolean
  }

  export type ProjectTaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'projectId'
      | 'code'
      | 'name'
      | 'status'
      | 'assignee'
      | 'startDate'
      | 'endDate'
      | 'progress'
      | 'parentId',
      ExtArgs['result']['projectTask']
    >
  export type ProjectTaskInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectTaskIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectTaskIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectTaskPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectTask'
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        projectId: number
        code: string
        name: string
        status: string
        assignee: string | null
        startDate: string | null
        endDate: string | null
        progress: number
        parentId: number | null
      },
      ExtArgs['result']['projectTask']
    >
    composites: {}
  }

  type ProjectTaskGetPayload<S extends boolean | null | undefined | ProjectTaskDefaultArgs> =
    $Result.GetResult<Prisma.$ProjectTaskPayload, S>

  type ProjectTaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectTaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectTaskCountAggregateInputType | true
    }

  export interface ProjectTaskDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectTask']
      meta: { name: 'ProjectTask' }
    }
    /**
     * Find zero or one ProjectTask that matches the filter.
     * @param {ProjectTaskFindUniqueArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectTaskFindUniqueArgs>(
      args: SelectSubset<T, ProjectTaskFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<
        Prisma.$ProjectTaskPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectTask that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectTaskFindUniqueOrThrowArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectTaskFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectTaskFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<
        Prisma.$ProjectTaskPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectTask that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskFindFirstArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectTaskFindFirstArgs>(
      args?: SelectSubset<T, ProjectTaskFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<
        Prisma.$ProjectTaskPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectTask that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskFindFirstOrThrowArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectTaskFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectTaskFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<
        Prisma.$ProjectTaskPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectTasks
     * const projectTasks = await prisma.projectTask.findMany()
     *
     * // Get first 10 ProjectTasks
     * const projectTasks = await prisma.projectTask.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectTaskWithIdOnly = await prisma.projectTask.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectTaskFindManyArgs>(
      args?: SelectSubset<T, ProjectTaskFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectTask.
     * @param {ProjectTaskCreateArgs} args - Arguments to create a ProjectTask.
     * @example
     * // Create one ProjectTask
     * const ProjectTask = await prisma.projectTask.create({
     *   data: {
     *     // ... data to create a ProjectTask
     *   }
     * })
     *
     */
    create<T extends ProjectTaskCreateArgs>(
      args: SelectSubset<T, ProjectTaskCreateArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectTasks.
     * @param {ProjectTaskCreateManyArgs} args - Arguments to create many ProjectTasks.
     * @example
     * // Create many ProjectTasks
     * const projectTask = await prisma.projectTask.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectTaskCreateManyArgs>(
      args?: SelectSubset<T, ProjectTaskCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectTasks and returns the data saved in the database.
     * @param {ProjectTaskCreateManyAndReturnArgs} args - Arguments to create many ProjectTasks.
     * @example
     * // Create many ProjectTasks
     * const projectTask = await prisma.projectTask.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectTasks and only return the `id`
     * const projectTaskWithIdOnly = await prisma.projectTask.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectTaskCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectTaskCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectTaskPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectTask.
     * @param {ProjectTaskDeleteArgs} args - Arguments to delete one ProjectTask.
     * @example
     * // Delete one ProjectTask
     * const ProjectTask = await prisma.projectTask.delete({
     *   where: {
     *     // ... filter to delete one ProjectTask
     *   }
     * })
     *
     */
    delete<T extends ProjectTaskDeleteArgs>(
      args: SelectSubset<T, ProjectTaskDeleteArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectTask.
     * @param {ProjectTaskUpdateArgs} args - Arguments to update one ProjectTask.
     * @example
     * // Update one ProjectTask
     * const projectTask = await prisma.projectTask.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectTaskUpdateArgs>(
      args: SelectSubset<T, ProjectTaskUpdateArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectTasks.
     * @param {ProjectTaskDeleteManyArgs} args - Arguments to filter ProjectTasks to delete.
     * @example
     * // Delete a few ProjectTasks
     * const { count } = await prisma.projectTask.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectTaskDeleteManyArgs>(
      args?: SelectSubset<T, ProjectTaskDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectTasks
     * const projectTask = await prisma.projectTask.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectTaskUpdateManyArgs>(
      args: SelectSubset<T, ProjectTaskUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectTasks and returns the data updated in the database.
     * @param {ProjectTaskUpdateManyAndReturnArgs} args - Arguments to update many ProjectTasks.
     * @example
     * // Update many ProjectTasks
     * const projectTask = await prisma.projectTask.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectTasks and only return the `id`
     * const projectTaskWithIdOnly = await prisma.projectTask.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectTaskUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectTaskUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectTaskPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectTask.
     * @param {ProjectTaskUpsertArgs} args - Arguments to update or create a ProjectTask.
     * @example
     * // Update or create a ProjectTask
     * const projectTask = await prisma.projectTask.upsert({
     *   create: {
     *     // ... data to create a ProjectTask
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectTask we want to update
     *   }
     * })
     */
    upsert<T extends ProjectTaskUpsertArgs>(
      args: SelectSubset<T, ProjectTaskUpsertArgs<ExtArgs>>
    ): Prisma__ProjectTaskClient<
      $Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskCountArgs} args - Arguments to filter ProjectTasks to count.
     * @example
     * // Count the number of ProjectTasks
     * const count = await prisma.projectTask.count({
     *   where: {
     *     // ... the filter for the ProjectTasks we want to count
     *   }
     * })
     **/
    count<T extends ProjectTaskCountArgs>(
      args?: Subset<T, ProjectTaskCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectTaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectTaskAggregateArgs>(
      args: Subset<T, ProjectTaskAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectTaskAggregateType<T>>

    /**
     * Group by ProjectTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectTaskGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectTaskGroupByArgs['orderBy'] }
        : { orderBy?: ProjectTaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectTaskGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProjectTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectTask model
     */
    readonly fields: ProjectTaskFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectTask.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectTaskClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectTask model
   */
  interface ProjectTaskFieldRefs {
    readonly id: FieldRef<'ProjectTask', 'Int'>
    readonly projectId: FieldRef<'ProjectTask', 'Int'>
    readonly code: FieldRef<'ProjectTask', 'String'>
    readonly name: FieldRef<'ProjectTask', 'String'>
    readonly status: FieldRef<'ProjectTask', 'String'>
    readonly assignee: FieldRef<'ProjectTask', 'String'>
    readonly startDate: FieldRef<'ProjectTask', 'String'>
    readonly endDate: FieldRef<'ProjectTask', 'String'>
    readonly progress: FieldRef<'ProjectTask', 'Int'>
    readonly parentId: FieldRef<'ProjectTask', 'Int'>
  }

  // Custom InputTypes
  /**
   * ProjectTask findUnique
   */
  export type ProjectTaskFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask findUniqueOrThrow
   */
  export type ProjectTaskFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask findFirst
   */
  export type ProjectTaskFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectTasks.
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectTasks.
     */
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * ProjectTask findFirstOrThrow
   */
  export type ProjectTaskFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectTasks.
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectTasks.
     */
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * ProjectTask findMany
   */
  export type ProjectTaskFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTasks to fetch.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectTasks.
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectTasks.
     */
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * ProjectTask create
   */
  export type ProjectTaskCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectTask.
     */
    data: XOR<ProjectTaskCreateInput, ProjectTaskUncheckedCreateInput>
  }

  /**
   * ProjectTask createMany
   */
  export type ProjectTaskCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectTasks.
     */
    data: ProjectTaskCreateManyInput | ProjectTaskCreateManyInput[]
  }

  /**
   * ProjectTask createManyAndReturn
   */
  export type ProjectTaskCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectTasks.
     */
    data: ProjectTaskCreateManyInput | ProjectTaskCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectTask update
   */
  export type ProjectTaskUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectTask.
     */
    data: XOR<ProjectTaskUpdateInput, ProjectTaskUncheckedUpdateInput>
    /**
     * Choose, which ProjectTask to update.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask updateMany
   */
  export type ProjectTaskUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectTasks.
     */
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyInput>
    /**
     * Filter which ProjectTasks to update
     */
    where?: ProjectTaskWhereInput
    /**
     * Limit how many ProjectTasks to update.
     */
    limit?: number
  }

  /**
   * ProjectTask updateManyAndReturn
   */
  export type ProjectTaskUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * The data used to update ProjectTasks.
     */
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyInput>
    /**
     * Filter which ProjectTasks to update
     */
    where?: ProjectTaskWhereInput
    /**
     * Limit how many ProjectTasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectTask upsert
   */
  export type ProjectTaskUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectTask to update in case it exists.
     */
    where: ProjectTaskWhereUniqueInput
    /**
     * In case the ProjectTask found by the `where` argument doesn't exist, create a new ProjectTask with this data.
     */
    create: XOR<ProjectTaskCreateInput, ProjectTaskUncheckedCreateInput>
    /**
     * In case the ProjectTask was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectTaskUpdateInput, ProjectTaskUncheckedUpdateInput>
  }

  /**
   * ProjectTask delete
   */
  export type ProjectTaskDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter which ProjectTask to delete.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask deleteMany
   */
  export type ProjectTaskDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectTasks to delete
     */
    where?: ProjectTaskWhereInput
    /**
     * Limit how many ProjectTasks to delete.
     */
    limit?: number
  }

  /**
   * ProjectTask without action
   */
  export type ProjectTaskDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
  }

  /**
   * Model ProjectRisk
   */

  export type AggregateProjectRisk = {
    _count: ProjectRiskCountAggregateOutputType | null
    _avg: ProjectRiskAvgAggregateOutputType | null
    _sum: ProjectRiskSumAggregateOutputType | null
    _min: ProjectRiskMinAggregateOutputType | null
    _max: ProjectRiskMaxAggregateOutputType | null
  }

  export type ProjectRiskAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectRiskSumAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectRiskMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    title: string | null
    level: string | null
    probability: string | null
    impact: string | null
    mitigation: string | null
    status: string | null
  }

  export type ProjectRiskMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    title: string | null
    level: string | null
    probability: string | null
    impact: string | null
    mitigation: string | null
    status: string | null
  }

  export type ProjectRiskCountAggregateOutputType = {
    id: number
    projectId: number
    title: number
    level: number
    probability: number
    impact: number
    mitigation: number
    status: number
    _all: number
  }

  export type ProjectRiskAvgAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectRiskSumAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectRiskMinAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    level?: true
    probability?: true
    impact?: true
    mitigation?: true
    status?: true
  }

  export type ProjectRiskMaxAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    level?: true
    probability?: true
    impact?: true
    mitigation?: true
    status?: true
  }

  export type ProjectRiskCountAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    level?: true
    probability?: true
    impact?: true
    mitigation?: true
    status?: true
    _all?: true
  }

  export type ProjectRiskAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectRisk to aggregate.
     */
    where?: ProjectRiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRisks to fetch.
     */
    orderBy?: ProjectRiskOrderByWithRelationInput | ProjectRiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectRiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRisks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRisks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectRisks
     **/
    _count?: true | ProjectRiskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectRiskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectRiskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectRiskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectRiskMaxAggregateInputType
  }

  export type GetProjectRiskAggregateType<T extends ProjectRiskAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectRisk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectRisk[P]>
      : GetScalarType<T[P], AggregateProjectRisk[P]>
  }

  export type ProjectRiskGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectRiskWhereInput
    orderBy?: ProjectRiskOrderByWithAggregationInput | ProjectRiskOrderByWithAggregationInput[]
    by: ProjectRiskScalarFieldEnum[] | ProjectRiskScalarFieldEnum
    having?: ProjectRiskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectRiskCountAggregateInputType | true
    _avg?: ProjectRiskAvgAggregateInputType
    _sum?: ProjectRiskSumAggregateInputType
    _min?: ProjectRiskMinAggregateInputType
    _max?: ProjectRiskMaxAggregateInputType
  }

  export type ProjectRiskGroupByOutputType = {
    id: number
    projectId: number
    title: string
    level: string
    probability: string | null
    impact: string | null
    mitigation: string | null
    status: string
    _count: ProjectRiskCountAggregateOutputType | null
    _avg: ProjectRiskAvgAggregateOutputType | null
    _sum: ProjectRiskSumAggregateOutputType | null
    _min: ProjectRiskMinAggregateOutputType | null
    _max: ProjectRiskMaxAggregateOutputType | null
  }

  type GetProjectRiskGroupByPayload<T extends ProjectRiskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectRiskGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProjectRiskGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProjectRiskGroupByOutputType[P]>
          : GetScalarType<T[P], ProjectRiskGroupByOutputType[P]>
      }
    >
  >

  export type ProjectRiskSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      title?: boolean
      level?: boolean
      probability?: boolean
      impact?: boolean
      mitigation?: boolean
      status?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectRisk']
  >

  export type ProjectRiskSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      title?: boolean
      level?: boolean
      probability?: boolean
      impact?: boolean
      mitigation?: boolean
      status?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectRisk']
  >

  export type ProjectRiskSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      title?: boolean
      level?: boolean
      probability?: boolean
      impact?: boolean
      mitigation?: boolean
      status?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectRisk']
  >

  export type ProjectRiskSelectScalar = {
    id?: boolean
    projectId?: boolean
    title?: boolean
    level?: boolean
    probability?: boolean
    impact?: boolean
    mitigation?: boolean
    status?: boolean
  }

  export type ProjectRiskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'projectId' | 'title' | 'level' | 'probability' | 'impact' | 'mitigation' | 'status',
      ExtArgs['result']['projectRisk']
    >
  export type ProjectRiskInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectRiskIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectRiskIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectRiskPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectRisk'
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        projectId: number
        title: string
        level: string
        probability: string | null
        impact: string | null
        mitigation: string | null
        status: string
      },
      ExtArgs['result']['projectRisk']
    >
    composites: {}
  }

  type ProjectRiskGetPayload<S extends boolean | null | undefined | ProjectRiskDefaultArgs> =
    $Result.GetResult<Prisma.$ProjectRiskPayload, S>

  type ProjectRiskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectRiskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectRiskCountAggregateInputType | true
    }

  export interface ProjectRiskDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectRisk']
      meta: { name: 'ProjectRisk' }
    }
    /**
     * Find zero or one ProjectRisk that matches the filter.
     * @param {ProjectRiskFindUniqueArgs} args - Arguments to find a ProjectRisk
     * @example
     * // Get one ProjectRisk
     * const projectRisk = await prisma.projectRisk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectRiskFindUniqueArgs>(
      args: SelectSubset<T, ProjectRiskFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<
        Prisma.$ProjectRiskPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectRisk that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectRiskFindUniqueOrThrowArgs} args - Arguments to find a ProjectRisk
     * @example
     * // Get one ProjectRisk
     * const projectRisk = await prisma.projectRisk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectRiskFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectRiskFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<
        Prisma.$ProjectRiskPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectRisk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskFindFirstArgs} args - Arguments to find a ProjectRisk
     * @example
     * // Get one ProjectRisk
     * const projectRisk = await prisma.projectRisk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectRiskFindFirstArgs>(
      args?: SelectSubset<T, ProjectRiskFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<
        Prisma.$ProjectRiskPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectRisk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskFindFirstOrThrowArgs} args - Arguments to find a ProjectRisk
     * @example
     * // Get one ProjectRisk
     * const projectRisk = await prisma.projectRisk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectRiskFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectRiskFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<
        Prisma.$ProjectRiskPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectRisks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectRisks
     * const projectRisks = await prisma.projectRisk.findMany()
     *
     * // Get first 10 ProjectRisks
     * const projectRisks = await prisma.projectRisk.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectRiskWithIdOnly = await prisma.projectRisk.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectRiskFindManyArgs>(
      args?: SelectSubset<T, ProjectRiskFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectRiskPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectRisk.
     * @param {ProjectRiskCreateArgs} args - Arguments to create a ProjectRisk.
     * @example
     * // Create one ProjectRisk
     * const ProjectRisk = await prisma.projectRisk.create({
     *   data: {
     *     // ... data to create a ProjectRisk
     *   }
     * })
     *
     */
    create<T extends ProjectRiskCreateArgs>(
      args: SelectSubset<T, ProjectRiskCreateArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<Prisma.$ProjectRiskPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectRisks.
     * @param {ProjectRiskCreateManyArgs} args - Arguments to create many ProjectRisks.
     * @example
     * // Create many ProjectRisks
     * const projectRisk = await prisma.projectRisk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectRiskCreateManyArgs>(
      args?: SelectSubset<T, ProjectRiskCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectRisks and returns the data saved in the database.
     * @param {ProjectRiskCreateManyAndReturnArgs} args - Arguments to create many ProjectRisks.
     * @example
     * // Create many ProjectRisks
     * const projectRisk = await prisma.projectRisk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectRisks and only return the `id`
     * const projectRiskWithIdOnly = await prisma.projectRisk.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectRiskCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectRiskCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectRiskPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectRisk.
     * @param {ProjectRiskDeleteArgs} args - Arguments to delete one ProjectRisk.
     * @example
     * // Delete one ProjectRisk
     * const ProjectRisk = await prisma.projectRisk.delete({
     *   where: {
     *     // ... filter to delete one ProjectRisk
     *   }
     * })
     *
     */
    delete<T extends ProjectRiskDeleteArgs>(
      args: SelectSubset<T, ProjectRiskDeleteArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<Prisma.$ProjectRiskPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectRisk.
     * @param {ProjectRiskUpdateArgs} args - Arguments to update one ProjectRisk.
     * @example
     * // Update one ProjectRisk
     * const projectRisk = await prisma.projectRisk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectRiskUpdateArgs>(
      args: SelectSubset<T, ProjectRiskUpdateArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<Prisma.$ProjectRiskPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectRisks.
     * @param {ProjectRiskDeleteManyArgs} args - Arguments to filter ProjectRisks to delete.
     * @example
     * // Delete a few ProjectRisks
     * const { count } = await prisma.projectRisk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectRiskDeleteManyArgs>(
      args?: SelectSubset<T, ProjectRiskDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectRisks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectRisks
     * const projectRisk = await prisma.projectRisk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectRiskUpdateManyArgs>(
      args: SelectSubset<T, ProjectRiskUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectRisks and returns the data updated in the database.
     * @param {ProjectRiskUpdateManyAndReturnArgs} args - Arguments to update many ProjectRisks.
     * @example
     * // Update many ProjectRisks
     * const projectRisk = await prisma.projectRisk.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectRisks and only return the `id`
     * const projectRiskWithIdOnly = await prisma.projectRisk.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectRiskUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectRiskUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectRiskPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectRisk.
     * @param {ProjectRiskUpsertArgs} args - Arguments to update or create a ProjectRisk.
     * @example
     * // Update or create a ProjectRisk
     * const projectRisk = await prisma.projectRisk.upsert({
     *   create: {
     *     // ... data to create a ProjectRisk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectRisk we want to update
     *   }
     * })
     */
    upsert<T extends ProjectRiskUpsertArgs>(
      args: SelectSubset<T, ProjectRiskUpsertArgs<ExtArgs>>
    ): Prisma__ProjectRiskClient<
      $Result.GetResult<Prisma.$ProjectRiskPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectRisks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskCountArgs} args - Arguments to filter ProjectRisks to count.
     * @example
     * // Count the number of ProjectRisks
     * const count = await prisma.projectRisk.count({
     *   where: {
     *     // ... the filter for the ProjectRisks we want to count
     *   }
     * })
     **/
    count<T extends ProjectRiskCountArgs>(
      args?: Subset<T, ProjectRiskCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectRiskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectRisk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectRiskAggregateArgs>(
      args: Subset<T, ProjectRiskAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectRiskAggregateType<T>>

    /**
     * Group by ProjectRisk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectRiskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectRiskGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectRiskGroupByArgs['orderBy'] }
        : { orderBy?: ProjectRiskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectRiskGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors ? GetProjectRiskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectRisk model
     */
    readonly fields: ProjectRiskFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectRisk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectRiskClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectRisk model
   */
  interface ProjectRiskFieldRefs {
    readonly id: FieldRef<'ProjectRisk', 'Int'>
    readonly projectId: FieldRef<'ProjectRisk', 'Int'>
    readonly title: FieldRef<'ProjectRisk', 'String'>
    readonly level: FieldRef<'ProjectRisk', 'String'>
    readonly probability: FieldRef<'ProjectRisk', 'String'>
    readonly impact: FieldRef<'ProjectRisk', 'String'>
    readonly mitigation: FieldRef<'ProjectRisk', 'String'>
    readonly status: FieldRef<'ProjectRisk', 'String'>
  }

  // Custom InputTypes
  /**
   * ProjectRisk findUnique
   */
  export type ProjectRiskFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectRisk to fetch.
     */
    where: ProjectRiskWhereUniqueInput
  }

  /**
   * ProjectRisk findUniqueOrThrow
   */
  export type ProjectRiskFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectRisk to fetch.
     */
    where: ProjectRiskWhereUniqueInput
  }

  /**
   * ProjectRisk findFirst
   */
  export type ProjectRiskFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectRisk to fetch.
     */
    where?: ProjectRiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRisks to fetch.
     */
    orderBy?: ProjectRiskOrderByWithRelationInput | ProjectRiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectRisks.
     */
    cursor?: ProjectRiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRisks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRisks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectRisks.
     */
    distinct?: ProjectRiskScalarFieldEnum | ProjectRiskScalarFieldEnum[]
  }

  /**
   * ProjectRisk findFirstOrThrow
   */
  export type ProjectRiskFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectRisk to fetch.
     */
    where?: ProjectRiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRisks to fetch.
     */
    orderBy?: ProjectRiskOrderByWithRelationInput | ProjectRiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectRisks.
     */
    cursor?: ProjectRiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRisks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRisks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectRisks.
     */
    distinct?: ProjectRiskScalarFieldEnum | ProjectRiskScalarFieldEnum[]
  }

  /**
   * ProjectRisk findMany
   */
  export type ProjectRiskFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectRisks to fetch.
     */
    where?: ProjectRiskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectRisks to fetch.
     */
    orderBy?: ProjectRiskOrderByWithRelationInput | ProjectRiskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectRisks.
     */
    cursor?: ProjectRiskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectRisks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectRisks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectRisks.
     */
    distinct?: ProjectRiskScalarFieldEnum | ProjectRiskScalarFieldEnum[]
  }

  /**
   * ProjectRisk create
   */
  export type ProjectRiskCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectRisk.
     */
    data: XOR<ProjectRiskCreateInput, ProjectRiskUncheckedCreateInput>
  }

  /**
   * ProjectRisk createMany
   */
  export type ProjectRiskCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectRisks.
     */
    data: ProjectRiskCreateManyInput | ProjectRiskCreateManyInput[]
  }

  /**
   * ProjectRisk createManyAndReturn
   */
  export type ProjectRiskCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectRisks.
     */
    data: ProjectRiskCreateManyInput | ProjectRiskCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectRisk update
   */
  export type ProjectRiskUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectRisk.
     */
    data: XOR<ProjectRiskUpdateInput, ProjectRiskUncheckedUpdateInput>
    /**
     * Choose, which ProjectRisk to update.
     */
    where: ProjectRiskWhereUniqueInput
  }

  /**
   * ProjectRisk updateMany
   */
  export type ProjectRiskUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectRisks.
     */
    data: XOR<ProjectRiskUpdateManyMutationInput, ProjectRiskUncheckedUpdateManyInput>
    /**
     * Filter which ProjectRisks to update
     */
    where?: ProjectRiskWhereInput
    /**
     * Limit how many ProjectRisks to update.
     */
    limit?: number
  }

  /**
   * ProjectRisk updateManyAndReturn
   */
  export type ProjectRiskUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * The data used to update ProjectRisks.
     */
    data: XOR<ProjectRiskUpdateManyMutationInput, ProjectRiskUncheckedUpdateManyInput>
    /**
     * Filter which ProjectRisks to update
     */
    where?: ProjectRiskWhereInput
    /**
     * Limit how many ProjectRisks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectRisk upsert
   */
  export type ProjectRiskUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectRisk to update in case it exists.
     */
    where: ProjectRiskWhereUniqueInput
    /**
     * In case the ProjectRisk found by the `where` argument doesn't exist, create a new ProjectRisk with this data.
     */
    create: XOR<ProjectRiskCreateInput, ProjectRiskUncheckedCreateInput>
    /**
     * In case the ProjectRisk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectRiskUpdateInput, ProjectRiskUncheckedUpdateInput>
  }

  /**
   * ProjectRisk delete
   */
  export type ProjectRiskDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
    /**
     * Filter which ProjectRisk to delete.
     */
    where: ProjectRiskWhereUniqueInput
  }

  /**
   * ProjectRisk deleteMany
   */
  export type ProjectRiskDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectRisks to delete
     */
    where?: ProjectRiskWhereInput
    /**
     * Limit how many ProjectRisks to delete.
     */
    limit?: number
  }

  /**
   * ProjectRisk without action
   */
  export type ProjectRiskDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectRisk
     */
    select?: ProjectRiskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectRisk
     */
    omit?: ProjectRiskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectRiskInclude<ExtArgs> | null
  }

  /**
   * Model ProjectMember
   */

  export type AggregateProjectMember = {
    _count: ProjectMemberCountAggregateOutputType | null
    _avg: ProjectMemberAvgAggregateOutputType | null
    _sum: ProjectMemberSumAggregateOutputType | null
    _min: ProjectMemberMinAggregateOutputType | null
    _max: ProjectMemberMaxAggregateOutputType | null
  }

  export type ProjectMemberAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectMemberSumAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectMemberMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    userId: string | null
    name: string | null
    role: string | null
    avatar: string | null
  }

  export type ProjectMemberMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    userId: string | null
    name: string | null
    role: string | null
    avatar: string | null
  }

  export type ProjectMemberCountAggregateOutputType = {
    id: number
    projectId: number
    userId: number
    name: number
    role: number
    avatar: number
    _all: number
  }

  export type ProjectMemberAvgAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectMemberSumAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectMemberMinAggregateInputType = {
    id?: true
    projectId?: true
    userId?: true
    name?: true
    role?: true
    avatar?: true
  }

  export type ProjectMemberMaxAggregateInputType = {
    id?: true
    projectId?: true
    userId?: true
    name?: true
    role?: true
    avatar?: true
  }

  export type ProjectMemberCountAggregateInputType = {
    id?: true
    projectId?: true
    userId?: true
    name?: true
    role?: true
    avatar?: true
    _all?: true
  }

  export type ProjectMemberAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectMember to aggregate.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectMembers
     **/
    _count?: true | ProjectMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectMemberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectMemberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectMemberMaxAggregateInputType
  }

  export type GetProjectMemberAggregateType<T extends ProjectMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectMember[P]>
      : GetScalarType<T[P], AggregateProjectMember[P]>
  }

  export type ProjectMemberGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithAggregationInput | ProjectMemberOrderByWithAggregationInput[]
    by: ProjectMemberScalarFieldEnum[] | ProjectMemberScalarFieldEnum
    having?: ProjectMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectMemberCountAggregateInputType | true
    _avg?: ProjectMemberAvgAggregateInputType
    _sum?: ProjectMemberSumAggregateInputType
    _min?: ProjectMemberMinAggregateInputType
    _max?: ProjectMemberMaxAggregateInputType
  }

  export type ProjectMemberGroupByOutputType = {
    id: number
    projectId: number
    userId: string
    name: string
    role: string
    avatar: string | null
    _count: ProjectMemberCountAggregateOutputType | null
    _avg: ProjectMemberAvgAggregateOutputType | null
    _sum: ProjectMemberSumAggregateOutputType | null
    _min: ProjectMemberMinAggregateOutputType | null
    _max: ProjectMemberMaxAggregateOutputType | null
  }

  type GetProjectMemberGroupByPayload<T extends ProjectMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectMemberGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ProjectMemberGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>
          : GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>
      }
    >
  >

  export type ProjectMemberSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      userId?: boolean
      name?: boolean
      role?: boolean
      avatar?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectMember']
  >

  export type ProjectMemberSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      userId?: boolean
      name?: boolean
      role?: boolean
      avatar?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectMember']
  >

  export type ProjectMemberSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      userId?: boolean
      name?: boolean
      role?: boolean
      avatar?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectMember']
  >

  export type ProjectMemberSelectScalar = {
    id?: boolean
    projectId?: boolean
    userId?: boolean
    name?: boolean
    role?: boolean
    avatar?: boolean
  }

  export type ProjectMemberOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'projectId' | 'userId' | 'name' | 'role' | 'avatar',
    ExtArgs['result']['projectMember']
  >
  export type ProjectMemberInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMemberIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMemberIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectMemberPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectMember'
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        projectId: number
        userId: string
        name: string
        role: string
        avatar: string | null
      },
      ExtArgs['result']['projectMember']
    >
    composites: {}
  }

  type ProjectMemberGetPayload<S extends boolean | null | undefined | ProjectMemberDefaultArgs> =
    $Result.GetResult<Prisma.$ProjectMemberPayload, S>

  type ProjectMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectMemberCountAggregateInputType | true
    }

  export interface ProjectMemberDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectMember']
      meta: { name: 'ProjectMember' }
    }
    /**
     * Find zero or one ProjectMember that matches the filter.
     * @param {ProjectMemberFindUniqueArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectMemberFindUniqueArgs>(
      args: SelectSubset<T, ProjectMemberFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<
        Prisma.$ProjectMemberPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectMemberFindUniqueOrThrowArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectMemberFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectMemberFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<
        Prisma.$ProjectMemberPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindFirstArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectMemberFindFirstArgs>(
      args?: SelectSubset<T, ProjectMemberFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<
        Prisma.$ProjectMemberPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindFirstOrThrowArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectMemberFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectMemberFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<
        Prisma.$ProjectMemberPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectMembers
     * const projectMembers = await prisma.projectMember.findMany()
     *
     * // Get first 10 ProjectMembers
     * const projectMembers = await prisma.projectMember.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectMemberFindManyArgs>(
      args?: SelectSubset<T, ProjectMemberFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectMember.
     * @param {ProjectMemberCreateArgs} args - Arguments to create a ProjectMember.
     * @example
     * // Create one ProjectMember
     * const ProjectMember = await prisma.projectMember.create({
     *   data: {
     *     // ... data to create a ProjectMember
     *   }
     * })
     *
     */
    create<T extends ProjectMemberCreateArgs>(
      args: SelectSubset<T, ProjectMemberCreateArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectMembers.
     * @param {ProjectMemberCreateManyArgs} args - Arguments to create many ProjectMembers.
     * @example
     * // Create many ProjectMembers
     * const projectMember = await prisma.projectMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectMemberCreateManyArgs>(
      args?: SelectSubset<T, ProjectMemberCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectMembers and returns the data saved in the database.
     * @param {ProjectMemberCreateManyAndReturnArgs} args - Arguments to create many ProjectMembers.
     * @example
     * // Create many ProjectMembers
     * const projectMember = await prisma.projectMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectMembers and only return the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectMemberCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectMemberCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectMemberPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectMember.
     * @param {ProjectMemberDeleteArgs} args - Arguments to delete one ProjectMember.
     * @example
     * // Delete one ProjectMember
     * const ProjectMember = await prisma.projectMember.delete({
     *   where: {
     *     // ... filter to delete one ProjectMember
     *   }
     * })
     *
     */
    delete<T extends ProjectMemberDeleteArgs>(
      args: SelectSubset<T, ProjectMemberDeleteArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectMember.
     * @param {ProjectMemberUpdateArgs} args - Arguments to update one ProjectMember.
     * @example
     * // Update one ProjectMember
     * const projectMember = await prisma.projectMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectMemberUpdateArgs>(
      args: SelectSubset<T, ProjectMemberUpdateArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectMembers.
     * @param {ProjectMemberDeleteManyArgs} args - Arguments to filter ProjectMembers to delete.
     * @example
     * // Delete a few ProjectMembers
     * const { count } = await prisma.projectMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectMemberDeleteManyArgs>(
      args?: SelectSubset<T, ProjectMemberDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectMembers
     * const projectMember = await prisma.projectMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectMemberUpdateManyArgs>(
      args: SelectSubset<T, ProjectMemberUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMembers and returns the data updated in the database.
     * @param {ProjectMemberUpdateManyAndReturnArgs} args - Arguments to update many ProjectMembers.
     * @example
     * // Update many ProjectMembers
     * const projectMember = await prisma.projectMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectMembers and only return the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectMemberUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectMemberUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectMemberPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectMember.
     * @param {ProjectMemberUpsertArgs} args - Arguments to update or create a ProjectMember.
     * @example
     * // Update or create a ProjectMember
     * const projectMember = await prisma.projectMember.upsert({
     *   create: {
     *     // ... data to create a ProjectMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectMember we want to update
     *   }
     * })
     */
    upsert<T extends ProjectMemberUpsertArgs>(
      args: SelectSubset<T, ProjectMemberUpsertArgs<ExtArgs>>
    ): Prisma__ProjectMemberClient<
      $Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberCountArgs} args - Arguments to filter ProjectMembers to count.
     * @example
     * // Count the number of ProjectMembers
     * const count = await prisma.projectMember.count({
     *   where: {
     *     // ... the filter for the ProjectMembers we want to count
     *   }
     * })
     **/
    count<T extends ProjectMemberCountArgs>(
      args?: Subset<T, ProjectMemberCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectMemberAggregateArgs>(
      args: Subset<T, ProjectMemberAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectMemberAggregateType<T>>

    /**
     * Group by ProjectMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectMemberGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectMemberGroupByArgs['orderBy'] }
        : { orderBy?: ProjectMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectMemberGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetProjectMemberGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectMember model
     */
    readonly fields: ProjectMemberFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectMemberClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectMember model
   */
  interface ProjectMemberFieldRefs {
    readonly id: FieldRef<'ProjectMember', 'Int'>
    readonly projectId: FieldRef<'ProjectMember', 'Int'>
    readonly userId: FieldRef<'ProjectMember', 'String'>
    readonly name: FieldRef<'ProjectMember', 'String'>
    readonly role: FieldRef<'ProjectMember', 'String'>
    readonly avatar: FieldRef<'ProjectMember', 'String'>
  }

  // Custom InputTypes
  /**
   * ProjectMember findUnique
   */
  export type ProjectMemberFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember findUniqueOrThrow
   */
  export type ProjectMemberFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember findFirst
   */
  export type ProjectMemberFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember findFirstOrThrow
   */
  export type ProjectMemberFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember findMany
   */
  export type ProjectMemberFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMembers to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember create
   */
  export type ProjectMemberCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectMember.
     */
    data: XOR<ProjectMemberCreateInput, ProjectMemberUncheckedCreateInput>
  }

  /**
   * ProjectMember createMany
   */
  export type ProjectMemberCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectMembers.
     */
    data: ProjectMemberCreateManyInput | ProjectMemberCreateManyInput[]
  }

  /**
   * ProjectMember createManyAndReturn
   */
  export type ProjectMemberCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectMembers.
     */
    data: ProjectMemberCreateManyInput | ProjectMemberCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMember update
   */
  export type ProjectMemberUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectMember.
     */
    data: XOR<ProjectMemberUpdateInput, ProjectMemberUncheckedUpdateInput>
    /**
     * Choose, which ProjectMember to update.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember updateMany
   */
  export type ProjectMemberUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectMembers.
     */
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMembers to update
     */
    where?: ProjectMemberWhereInput
    /**
     * Limit how many ProjectMembers to update.
     */
    limit?: number
  }

  /**
   * ProjectMember updateManyAndReturn
   */
  export type ProjectMemberUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * The data used to update ProjectMembers.
     */
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMembers to update
     */
    where?: ProjectMemberWhereInput
    /**
     * Limit how many ProjectMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMember upsert
   */
  export type ProjectMemberUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectMember to update in case it exists.
     */
    where: ProjectMemberWhereUniqueInput
    /**
     * In case the ProjectMember found by the `where` argument doesn't exist, create a new ProjectMember with this data.
     */
    create: XOR<ProjectMemberCreateInput, ProjectMemberUncheckedCreateInput>
    /**
     * In case the ProjectMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectMemberUpdateInput, ProjectMemberUncheckedUpdateInput>
  }

  /**
   * ProjectMember delete
   */
  export type ProjectMemberDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter which ProjectMember to delete.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember deleteMany
   */
  export type ProjectMemberDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectMembers to delete
     */
    where?: ProjectMemberWhereInput
    /**
     * Limit how many ProjectMembers to delete.
     */
    limit?: number
  }

  /**
   * ProjectMember without action
   */
  export type ProjectMemberDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
  }

  /**
   * Model ProjectStatusLog
   */

  export type AggregateProjectStatusLog = {
    _count: ProjectStatusLogCountAggregateOutputType | null
    _avg: ProjectStatusLogAvgAggregateOutputType | null
    _sum: ProjectStatusLogSumAggregateOutputType | null
    _min: ProjectStatusLogMinAggregateOutputType | null
    _max: ProjectStatusLogMaxAggregateOutputType | null
  }

  export type ProjectStatusLogAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectStatusLogSumAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type ProjectStatusLogMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    type: string | null
    at: Date | null
    operator: string | null
    message: string | null
    fromStatus: string | null
    toStatus: string | null
    reason: string | null
  }

  export type ProjectStatusLogMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    type: string | null
    at: Date | null
    operator: string | null
    message: string | null
    fromStatus: string | null
    toStatus: string | null
    reason: string | null
  }

  export type ProjectStatusLogCountAggregateOutputType = {
    id: number
    projectId: number
    type: number
    at: number
    operator: number
    message: number
    fromStatus: number
    toStatus: number
    reason: number
    _all: number
  }

  export type ProjectStatusLogAvgAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectStatusLogSumAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type ProjectStatusLogMinAggregateInputType = {
    id?: true
    projectId?: true
    type?: true
    at?: true
    operator?: true
    message?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
  }

  export type ProjectStatusLogMaxAggregateInputType = {
    id?: true
    projectId?: true
    type?: true
    at?: true
    operator?: true
    message?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
  }

  export type ProjectStatusLogCountAggregateInputType = {
    id?: true
    projectId?: true
    type?: true
    at?: true
    operator?: true
    message?: true
    fromStatus?: true
    toStatus?: true
    reason?: true
    _all?: true
  }

  export type ProjectStatusLogAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectStatusLog to aggregate.
     */
    where?: ProjectStatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStatusLogs to fetch.
     */
    orderBy?: ProjectStatusLogOrderByWithRelationInput | ProjectStatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProjectStatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProjectStatusLogs
     **/
    _count?: true | ProjectStatusLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProjectStatusLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProjectStatusLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProjectStatusLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProjectStatusLogMaxAggregateInputType
  }

  export type GetProjectStatusLogAggregateType<T extends ProjectStatusLogAggregateArgs> = {
    [P in keyof T & keyof AggregateProjectStatusLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectStatusLog[P]>
      : GetScalarType<T[P], AggregateProjectStatusLog[P]>
  }

  export type ProjectStatusLogGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProjectStatusLogWhereInput
    orderBy?:
      | ProjectStatusLogOrderByWithAggregationInput
      | ProjectStatusLogOrderByWithAggregationInput[]
    by: ProjectStatusLogScalarFieldEnum[] | ProjectStatusLogScalarFieldEnum
    having?: ProjectStatusLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectStatusLogCountAggregateInputType | true
    _avg?: ProjectStatusLogAvgAggregateInputType
    _sum?: ProjectStatusLogSumAggregateInputType
    _min?: ProjectStatusLogMinAggregateInputType
    _max?: ProjectStatusLogMaxAggregateInputType
  }

  export type ProjectStatusLogGroupByOutputType = {
    id: number
    projectId: number
    type: string
    at: Date
    operator: string
    message: string
    fromStatus: string | null
    toStatus: string | null
    reason: string | null
    _count: ProjectStatusLogCountAggregateOutputType | null
    _avg: ProjectStatusLogAvgAggregateOutputType | null
    _sum: ProjectStatusLogSumAggregateOutputType | null
    _min: ProjectStatusLogMinAggregateOutputType | null
    _max: ProjectStatusLogMaxAggregateOutputType | null
  }

  type GetProjectStatusLogGroupByPayload<T extends ProjectStatusLogGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProjectStatusLogGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProjectStatusLogGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectStatusLogGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectStatusLogGroupByOutputType[P]>
        }
      >
    >

  export type ProjectStatusLogSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      type?: boolean
      at?: boolean
      operator?: boolean
      message?: boolean
      fromStatus?: boolean
      toStatus?: boolean
      reason?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectStatusLog']
  >

  export type ProjectStatusLogSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      type?: boolean
      at?: boolean
      operator?: boolean
      message?: boolean
      fromStatus?: boolean
      toStatus?: boolean
      reason?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectStatusLog']
  >

  export type ProjectStatusLogSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      projectId?: boolean
      type?: boolean
      at?: boolean
      operator?: boolean
      message?: boolean
      fromStatus?: boolean
      toStatus?: boolean
      reason?: boolean
      project?: boolean | ProjectDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['projectStatusLog']
  >

  export type ProjectStatusLogSelectScalar = {
    id?: boolean
    projectId?: boolean
    type?: boolean
    at?: boolean
    operator?: boolean
    message?: boolean
    fromStatus?: boolean
    toStatus?: boolean
    reason?: boolean
  }

  export type ProjectStatusLogOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'projectId'
    | 'type'
    | 'at'
    | 'operator'
    | 'message'
    | 'fromStatus'
    | 'toStatus'
    | 'reason',
    ExtArgs['result']['projectStatusLog']
  >
  export type ProjectStatusLogInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectStatusLogIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectStatusLogIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectStatusLogPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProjectStatusLog'
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: number
        projectId: number
        type: string
        at: Date
        operator: string
        message: string
        fromStatus: string | null
        toStatus: string | null
        reason: string | null
      },
      ExtArgs['result']['projectStatusLog']
    >
    composites: {}
  }

  type ProjectStatusLogGetPayload<
    S extends boolean | null | undefined | ProjectStatusLogDefaultArgs,
  > = $Result.GetResult<Prisma.$ProjectStatusLogPayload, S>

  type ProjectStatusLogCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProjectStatusLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProjectStatusLogCountAggregateInputType | true
  }

  export interface ProjectStatusLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProjectStatusLog']
      meta: { name: 'ProjectStatusLog' }
    }
    /**
     * Find zero or one ProjectStatusLog that matches the filter.
     * @param {ProjectStatusLogFindUniqueArgs} args - Arguments to find a ProjectStatusLog
     * @example
     * // Get one ProjectStatusLog
     * const projectStatusLog = await prisma.projectStatusLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectStatusLogFindUniqueArgs>(
      args: SelectSubset<T, ProjectStatusLogFindUniqueArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<
        Prisma.$ProjectStatusLogPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one ProjectStatusLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectStatusLogFindUniqueOrThrowArgs} args - Arguments to find a ProjectStatusLog
     * @example
     * // Get one ProjectStatusLog
     * const projectStatusLog = await prisma.projectStatusLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectStatusLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProjectStatusLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<
        Prisma.$ProjectStatusLogPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectStatusLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogFindFirstArgs} args - Arguments to find a ProjectStatusLog
     * @example
     * // Get one ProjectStatusLog
     * const projectStatusLog = await prisma.projectStatusLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectStatusLogFindFirstArgs>(
      args?: SelectSubset<T, ProjectStatusLogFindFirstArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<
        Prisma.$ProjectStatusLogPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first ProjectStatusLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogFindFirstOrThrowArgs} args - Arguments to find a ProjectStatusLog
     * @example
     * // Get one ProjectStatusLog
     * const projectStatusLog = await prisma.projectStatusLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectStatusLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProjectStatusLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<
        Prisma.$ProjectStatusLogPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more ProjectStatusLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectStatusLogs
     * const projectStatusLogs = await prisma.projectStatusLog.findMany()
     *
     * // Get first 10 ProjectStatusLogs
     * const projectStatusLogs = await prisma.projectStatusLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const projectStatusLogWithIdOnly = await prisma.projectStatusLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProjectStatusLogFindManyArgs>(
      args?: SelectSubset<T, ProjectStatusLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProjectStatusLogPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >

    /**
     * Create a ProjectStatusLog.
     * @param {ProjectStatusLogCreateArgs} args - Arguments to create a ProjectStatusLog.
     * @example
     * // Create one ProjectStatusLog
     * const ProjectStatusLog = await prisma.projectStatusLog.create({
     *   data: {
     *     // ... data to create a ProjectStatusLog
     *   }
     * })
     *
     */
    create<T extends ProjectStatusLogCreateArgs>(
      args: SelectSubset<T, ProjectStatusLogCreateArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<Prisma.$ProjectStatusLogPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many ProjectStatusLogs.
     * @param {ProjectStatusLogCreateManyArgs} args - Arguments to create many ProjectStatusLogs.
     * @example
     * // Create many ProjectStatusLogs
     * const projectStatusLog = await prisma.projectStatusLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProjectStatusLogCreateManyArgs>(
      args?: SelectSubset<T, ProjectStatusLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectStatusLogs and returns the data saved in the database.
     * @param {ProjectStatusLogCreateManyAndReturnArgs} args - Arguments to create many ProjectStatusLogs.
     * @example
     * // Create many ProjectStatusLogs
     * const projectStatusLog = await prisma.projectStatusLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProjectStatusLogs and only return the `id`
     * const projectStatusLogWithIdOnly = await prisma.projectStatusLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProjectStatusLogCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProjectStatusLogCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectStatusLogPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Delete a ProjectStatusLog.
     * @param {ProjectStatusLogDeleteArgs} args - Arguments to delete one ProjectStatusLog.
     * @example
     * // Delete one ProjectStatusLog
     * const ProjectStatusLog = await prisma.projectStatusLog.delete({
     *   where: {
     *     // ... filter to delete one ProjectStatusLog
     *   }
     * })
     *
     */
    delete<T extends ProjectStatusLogDeleteArgs>(
      args: SelectSubset<T, ProjectStatusLogDeleteArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<Prisma.$ProjectStatusLogPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one ProjectStatusLog.
     * @param {ProjectStatusLogUpdateArgs} args - Arguments to update one ProjectStatusLog.
     * @example
     * // Update one ProjectStatusLog
     * const projectStatusLog = await prisma.projectStatusLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProjectStatusLogUpdateArgs>(
      args: SelectSubset<T, ProjectStatusLogUpdateArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<Prisma.$ProjectStatusLogPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more ProjectStatusLogs.
     * @param {ProjectStatusLogDeleteManyArgs} args - Arguments to filter ProjectStatusLogs to delete.
     * @example
     * // Delete a few ProjectStatusLogs
     * const { count } = await prisma.projectStatusLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProjectStatusLogDeleteManyArgs>(
      args?: SelectSubset<T, ProjectStatusLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectStatusLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectStatusLogs
     * const projectStatusLog = await prisma.projectStatusLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProjectStatusLogUpdateManyArgs>(
      args: SelectSubset<T, ProjectStatusLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectStatusLogs and returns the data updated in the database.
     * @param {ProjectStatusLogUpdateManyAndReturnArgs} args - Arguments to update many ProjectStatusLogs.
     * @example
     * // Update many ProjectStatusLogs
     * const projectStatusLog = await prisma.projectStatusLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ProjectStatusLogs and only return the `id`
     * const projectStatusLogWithIdOnly = await prisma.projectStatusLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProjectStatusLogUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProjectStatusLogUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProjectStatusLogPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >

    /**
     * Create or update one ProjectStatusLog.
     * @param {ProjectStatusLogUpsertArgs} args - Arguments to update or create a ProjectStatusLog.
     * @example
     * // Update or create a ProjectStatusLog
     * const projectStatusLog = await prisma.projectStatusLog.upsert({
     *   create: {
     *     // ... data to create a ProjectStatusLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectStatusLog we want to update
     *   }
     * })
     */
    upsert<T extends ProjectStatusLogUpsertArgs>(
      args: SelectSubset<T, ProjectStatusLogUpsertArgs<ExtArgs>>
    ): Prisma__ProjectStatusLogClient<
      $Result.GetResult<Prisma.$ProjectStatusLogPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of ProjectStatusLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogCountArgs} args - Arguments to filter ProjectStatusLogs to count.
     * @example
     * // Count the number of ProjectStatusLogs
     * const count = await prisma.projectStatusLog.count({
     *   where: {
     *     // ... the filter for the ProjectStatusLogs we want to count
     *   }
     * })
     **/
    count<T extends ProjectStatusLogCountArgs>(
      args?: Subset<T, ProjectStatusLogCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectStatusLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectStatusLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProjectStatusLogAggregateArgs>(
      args: Subset<T, ProjectStatusLogAggregateArgs>
    ): Prisma.PrismaPromise<GetProjectStatusLogAggregateType<T>>

    /**
     * Group by ProjectStatusLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectStatusLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProjectStatusLogGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectStatusLogGroupByArgs['orderBy'] }
        : { orderBy?: ProjectStatusLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProjectStatusLogGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetProjectStatusLogGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the ProjectStatusLog model
     */
    readonly fields: ProjectStatusLogFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectStatusLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectStatusLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProjectDefaultArgs<ExtArgs>>
    ): Prisma__ProjectClient<
      | $Result.GetResult<
          Prisma.$ProjectPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the ProjectStatusLog model
   */
  interface ProjectStatusLogFieldRefs {
    readonly id: FieldRef<'ProjectStatusLog', 'Int'>
    readonly projectId: FieldRef<'ProjectStatusLog', 'Int'>
    readonly type: FieldRef<'ProjectStatusLog', 'String'>
    readonly at: FieldRef<'ProjectStatusLog', 'DateTime'>
    readonly operator: FieldRef<'ProjectStatusLog', 'String'>
    readonly message: FieldRef<'ProjectStatusLog', 'String'>
    readonly fromStatus: FieldRef<'ProjectStatusLog', 'String'>
    readonly toStatus: FieldRef<'ProjectStatusLog', 'String'>
    readonly reason: FieldRef<'ProjectStatusLog', 'String'>
  }

  // Custom InputTypes
  /**
   * ProjectStatusLog findUnique
   */
  export type ProjectStatusLogFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * Filter, which ProjectStatusLog to fetch.
     */
    where: ProjectStatusLogWhereUniqueInput
  }

  /**
   * ProjectStatusLog findUniqueOrThrow
   */
  export type ProjectStatusLogFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * Filter, which ProjectStatusLog to fetch.
     */
    where: ProjectStatusLogWhereUniqueInput
  }

  /**
   * ProjectStatusLog findFirst
   */
  export type ProjectStatusLogFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * Filter, which ProjectStatusLog to fetch.
     */
    where?: ProjectStatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStatusLogs to fetch.
     */
    orderBy?: ProjectStatusLogOrderByWithRelationInput | ProjectStatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectStatusLogs.
     */
    cursor?: ProjectStatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectStatusLogs.
     */
    distinct?: ProjectStatusLogScalarFieldEnum | ProjectStatusLogScalarFieldEnum[]
  }

  /**
   * ProjectStatusLog findFirstOrThrow
   */
  export type ProjectStatusLogFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * Filter, which ProjectStatusLog to fetch.
     */
    where?: ProjectStatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStatusLogs to fetch.
     */
    orderBy?: ProjectStatusLogOrderByWithRelationInput | ProjectStatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProjectStatusLogs.
     */
    cursor?: ProjectStatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectStatusLogs.
     */
    distinct?: ProjectStatusLogScalarFieldEnum | ProjectStatusLogScalarFieldEnum[]
  }

  /**
   * ProjectStatusLog findMany
   */
  export type ProjectStatusLogFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * Filter, which ProjectStatusLogs to fetch.
     */
    where?: ProjectStatusLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProjectStatusLogs to fetch.
     */
    orderBy?: ProjectStatusLogOrderByWithRelationInput | ProjectStatusLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProjectStatusLogs.
     */
    cursor?: ProjectStatusLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProjectStatusLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProjectStatusLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProjectStatusLogs.
     */
    distinct?: ProjectStatusLogScalarFieldEnum | ProjectStatusLogScalarFieldEnum[]
  }

  /**
   * ProjectStatusLog create
   */
  export type ProjectStatusLogCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectStatusLog.
     */
    data: XOR<ProjectStatusLogCreateInput, ProjectStatusLogUncheckedCreateInput>
  }

  /**
   * ProjectStatusLog createMany
   */
  export type ProjectStatusLogCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProjectStatusLogs.
     */
    data: ProjectStatusLogCreateManyInput | ProjectStatusLogCreateManyInput[]
  }

  /**
   * ProjectStatusLog createManyAndReturn
   */
  export type ProjectStatusLogCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectStatusLogs.
     */
    data: ProjectStatusLogCreateManyInput | ProjectStatusLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectStatusLog update
   */
  export type ProjectStatusLogUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectStatusLog.
     */
    data: XOR<ProjectStatusLogUpdateInput, ProjectStatusLogUncheckedUpdateInput>
    /**
     * Choose, which ProjectStatusLog to update.
     */
    where: ProjectStatusLogWhereUniqueInput
  }

  /**
   * ProjectStatusLog updateMany
   */
  export type ProjectStatusLogUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProjectStatusLogs.
     */
    data: XOR<ProjectStatusLogUpdateManyMutationInput, ProjectStatusLogUncheckedUpdateManyInput>
    /**
     * Filter which ProjectStatusLogs to update
     */
    where?: ProjectStatusLogWhereInput
    /**
     * Limit how many ProjectStatusLogs to update.
     */
    limit?: number
  }

  /**
   * ProjectStatusLog updateManyAndReturn
   */
  export type ProjectStatusLogUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * The data used to update ProjectStatusLogs.
     */
    data: XOR<ProjectStatusLogUpdateManyMutationInput, ProjectStatusLogUncheckedUpdateManyInput>
    /**
     * Filter which ProjectStatusLogs to update
     */
    where?: ProjectStatusLogWhereInput
    /**
     * Limit how many ProjectStatusLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectStatusLog upsert
   */
  export type ProjectStatusLogUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectStatusLog to update in case it exists.
     */
    where: ProjectStatusLogWhereUniqueInput
    /**
     * In case the ProjectStatusLog found by the `where` argument doesn't exist, create a new ProjectStatusLog with this data.
     */
    create: XOR<ProjectStatusLogCreateInput, ProjectStatusLogUncheckedCreateInput>
    /**
     * In case the ProjectStatusLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectStatusLogUpdateInput, ProjectStatusLogUncheckedUpdateInput>
  }

  /**
   * ProjectStatusLog delete
   */
  export type ProjectStatusLogDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
    /**
     * Filter which ProjectStatusLog to delete.
     */
    where: ProjectStatusLogWhereUniqueInput
  }

  /**
   * ProjectStatusLog deleteMany
   */
  export type ProjectStatusLogDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProjectStatusLogs to delete
     */
    where?: ProjectStatusLogWhereInput
    /**
     * Limit how many ProjectStatusLogs to delete.
     */
    limit?: number
  }

  /**
   * ProjectStatusLog without action
   */
  export type ProjectStatusLogDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProjectStatusLog
     */
    select?: ProjectStatusLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectStatusLog
     */
    omit?: ProjectStatusLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectStatusLogInclude<ExtArgs> | null
  }

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  }

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]

  export const ProjectStateScalarFieldEnum: {
    id: 'id'
    envId: 'envId'
    snapshotJson: 'snapshotJson'
    updatedAt: 'updatedAt'
  }

  export type ProjectStateScalarFieldEnum =
    (typeof ProjectStateScalarFieldEnum)[keyof typeof ProjectStateScalarFieldEnum]

  export const TaskStateScalarFieldEnum: {
    id: 'id'
    envId: 'envId'
    contextKey: 'contextKey'
    snapshotJson: 'snapshotJson'
    updatedAt: 'updatedAt'
  }

  export type TaskStateScalarFieldEnum =
    (typeof TaskStateScalarFieldEnum)[keyof typeof TaskStateScalarFieldEnum]

  export const AcceptanceStateScalarFieldEnum: {
    id: 'id'
    envId: 'envId'
    projectCode: 'projectCode'
    snapshotJson: 'snapshotJson'
    updatedAt: 'updatedAt'
  }

  export type AcceptanceStateScalarFieldEnum =
    (typeof AcceptanceStateScalarFieldEnum)[keyof typeof AcceptanceStateScalarFieldEnum]

  export const SettlementStateScalarFieldEnum: {
    id: 'id'
    envId: 'envId'
    snapshotJson: 'snapshotJson'
    updatedAt: 'updatedAt'
  }

  export type SettlementStateScalarFieldEnum =
    (typeof SettlementStateScalarFieldEnum)[keyof typeof SettlementStateScalarFieldEnum]

  export const AuditLogScalarFieldEnum: {
    id: 'id'
    envId: 'envId'
    scene: 'scene'
    detail: 'detail'
    projectCode: 'projectCode'
    at: 'at'
    createdAt: 'createdAt'
  }

  export type AuditLogScalarFieldEnum =
    (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]

  export const IdempotencyKeyScalarFieldEnum: {
    key: 'key'
    scope: 'scope'
    envId: 'envId'
    requestHash: 'requestHash'
    responseStatus: 'responseStatus'
    responseBody: 'responseBody'
    createdAt: 'createdAt'
    expiredAt: 'expiredAt'
  }

  export type IdempotencyKeyScalarFieldEnum =
    (typeof IdempotencyKeyScalarFieldEnum)[keyof typeof IdempotencyKeyScalarFieldEnum]

  export const ProjectScalarFieldEnum: {
    id: 'id'
    code: 'code'
    name: 'name'
    status: 'status'
    stage: 'stage'
    progress: 'progress'
    budget: 'budget'
    teamSize: 'teamSize'
    dateRange: 'dateRange'
    description: 'description'
    owner: 'owner'
    riskLevel: 'riskLevel'
    milestone: 'milestone'
    tasks: 'tasks'
    templateId: 'templateId'
    dispatchStatus: 'dispatchStatus'
    executionStatus: 'executionStatus'
    acceptanceStatus: 'acceptanceStatus'
    settlementStatus: 'settlementStatus'
    pendingDispatchCount: 'pendingDispatchCount'
    pendingExecutionCount: 'pendingExecutionCount'
    pendingAcceptanceCount: 'pendingAcceptanceCount'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type ProjectScalarFieldEnum =
    (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]

  export const ProjectPhaseScalarFieldEnum: {
    id: 'id'
    projectId: 'projectId'
    name: 'name'
    startDate: 'startDate'
    endDate: 'endDate'
    progress: 'progress'
    status: 'status'
  }

  export type ProjectPhaseScalarFieldEnum =
    (typeof ProjectPhaseScalarFieldEnum)[keyof typeof ProjectPhaseScalarFieldEnum]

  export const ProjectMilestoneScalarFieldEnum: {
    id: 'id'
    projectId: 'projectId'
    name: 'name'
    dueDate: 'dueDate'
    status: 'status'
    assignee: 'assignee'
    completedDate: 'completedDate'
  }

  export type ProjectMilestoneScalarFieldEnum =
    (typeof ProjectMilestoneScalarFieldEnum)[keyof typeof ProjectMilestoneScalarFieldEnum]

  export const ProjectTaskScalarFieldEnum: {
    id: 'id'
    projectId: 'projectId'
    code: 'code'
    name: 'name'
    status: 'status'
    assignee: 'assignee'
    startDate: 'startDate'
    endDate: 'endDate'
    progress: 'progress'
    parentId: 'parentId'
  }

  export type ProjectTaskScalarFieldEnum =
    (typeof ProjectTaskScalarFieldEnum)[keyof typeof ProjectTaskScalarFieldEnum]

  export const ProjectRiskScalarFieldEnum: {
    id: 'id'
    projectId: 'projectId'
    title: 'title'
    level: 'level'
    probability: 'probability'
    impact: 'impact'
    mitigation: 'mitigation'
    status: 'status'
  }

  export type ProjectRiskScalarFieldEnum =
    (typeof ProjectRiskScalarFieldEnum)[keyof typeof ProjectRiskScalarFieldEnum]

  export const ProjectMemberScalarFieldEnum: {
    id: 'id'
    projectId: 'projectId'
    userId: 'userId'
    name: 'name'
    role: 'role'
    avatar: 'avatar'
  }

  export type ProjectMemberScalarFieldEnum =
    (typeof ProjectMemberScalarFieldEnum)[keyof typeof ProjectMemberScalarFieldEnum]

  export const ProjectStatusLogScalarFieldEnum: {
    id: 'id'
    projectId: 'projectId'
    type: 'type'
    at: 'at'
    operator: 'operator'
    message: 'message'
    fromStatus: 'fromStatus'
    toStatus: 'toStatus'
    reason: 'reason'
  }

  export type ProjectStatusLogScalarFieldEnum =
    (typeof ProjectStatusLogScalarFieldEnum)[keyof typeof ProjectStatusLogScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const NullsOrder: {
    first: 'first'
    last: 'last'
  }

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>

  /**
   * Deep Input Types
   */

  export type ProjectStateWhereInput = {
    AND?: ProjectStateWhereInput | ProjectStateWhereInput[]
    OR?: ProjectStateWhereInput[]
    NOT?: ProjectStateWhereInput | ProjectStateWhereInput[]
    id?: IntFilter<'ProjectState'> | number
    envId?: StringFilter<'ProjectState'> | string
    snapshotJson?: StringFilter<'ProjectState'> | string
    updatedAt?: DateTimeFilter<'ProjectState'> | Date | string
  }

  export type ProjectStateOrderByWithRelationInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectStateWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      envId?: string
      AND?: ProjectStateWhereInput | ProjectStateWhereInput[]
      OR?: ProjectStateWhereInput[]
      NOT?: ProjectStateWhereInput | ProjectStateWhereInput[]
      snapshotJson?: StringFilter<'ProjectState'> | string
      updatedAt?: DateTimeFilter<'ProjectState'> | Date | string
    },
    'id' | 'envId'
  >

  export type ProjectStateOrderByWithAggregationInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectStateCountOrderByAggregateInput
    _avg?: ProjectStateAvgOrderByAggregateInput
    _max?: ProjectStateMaxOrderByAggregateInput
    _min?: ProjectStateMinOrderByAggregateInput
    _sum?: ProjectStateSumOrderByAggregateInput
  }

  export type ProjectStateScalarWhereWithAggregatesInput = {
    AND?: ProjectStateScalarWhereWithAggregatesInput | ProjectStateScalarWhereWithAggregatesInput[]
    OR?: ProjectStateScalarWhereWithAggregatesInput[]
    NOT?: ProjectStateScalarWhereWithAggregatesInput | ProjectStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectState'> | number
    envId?: StringWithAggregatesFilter<'ProjectState'> | string
    snapshotJson?: StringWithAggregatesFilter<'ProjectState'> | string
    updatedAt?: DateTimeWithAggregatesFilter<'ProjectState'> | Date | string
  }

  export type TaskStateWhereInput = {
    AND?: TaskStateWhereInput | TaskStateWhereInput[]
    OR?: TaskStateWhereInput[]
    NOT?: TaskStateWhereInput | TaskStateWhereInput[]
    id?: IntFilter<'TaskState'> | number
    envId?: StringFilter<'TaskState'> | string
    contextKey?: StringFilter<'TaskState'> | string
    snapshotJson?: StringFilter<'TaskState'> | string
    updatedAt?: DateTimeFilter<'TaskState'> | Date | string
  }

  export type TaskStateOrderByWithRelationInput = {
    id?: SortOrder
    envId?: SortOrder
    contextKey?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskStateWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      envId_contextKey?: TaskStateEnvIdContextKeyCompoundUniqueInput
      AND?: TaskStateWhereInput | TaskStateWhereInput[]
      OR?: TaskStateWhereInput[]
      NOT?: TaskStateWhereInput | TaskStateWhereInput[]
      envId?: StringFilter<'TaskState'> | string
      contextKey?: StringFilter<'TaskState'> | string
      snapshotJson?: StringFilter<'TaskState'> | string
      updatedAt?: DateTimeFilter<'TaskState'> | Date | string
    },
    'id' | 'envId_contextKey'
  >

  export type TaskStateOrderByWithAggregationInput = {
    id?: SortOrder
    envId?: SortOrder
    contextKey?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskStateCountOrderByAggregateInput
    _avg?: TaskStateAvgOrderByAggregateInput
    _max?: TaskStateMaxOrderByAggregateInput
    _min?: TaskStateMinOrderByAggregateInput
    _sum?: TaskStateSumOrderByAggregateInput
  }

  export type TaskStateScalarWhereWithAggregatesInput = {
    AND?: TaskStateScalarWhereWithAggregatesInput | TaskStateScalarWhereWithAggregatesInput[]
    OR?: TaskStateScalarWhereWithAggregatesInput[]
    NOT?: TaskStateScalarWhereWithAggregatesInput | TaskStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'TaskState'> | number
    envId?: StringWithAggregatesFilter<'TaskState'> | string
    contextKey?: StringWithAggregatesFilter<'TaskState'> | string
    snapshotJson?: StringWithAggregatesFilter<'TaskState'> | string
    updatedAt?: DateTimeWithAggregatesFilter<'TaskState'> | Date | string
  }

  export type AcceptanceStateWhereInput = {
    AND?: AcceptanceStateWhereInput | AcceptanceStateWhereInput[]
    OR?: AcceptanceStateWhereInput[]
    NOT?: AcceptanceStateWhereInput | AcceptanceStateWhereInput[]
    id?: IntFilter<'AcceptanceState'> | number
    envId?: StringFilter<'AcceptanceState'> | string
    projectCode?: StringFilter<'AcceptanceState'> | string
    snapshotJson?: StringFilter<'AcceptanceState'> | string
    updatedAt?: DateTimeFilter<'AcceptanceState'> | Date | string
  }

  export type AcceptanceStateOrderByWithRelationInput = {
    id?: SortOrder
    envId?: SortOrder
    projectCode?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type AcceptanceStateWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      envId_projectCode?: AcceptanceStateEnvIdProjectCodeCompoundUniqueInput
      AND?: AcceptanceStateWhereInput | AcceptanceStateWhereInput[]
      OR?: AcceptanceStateWhereInput[]
      NOT?: AcceptanceStateWhereInput | AcceptanceStateWhereInput[]
      envId?: StringFilter<'AcceptanceState'> | string
      projectCode?: StringFilter<'AcceptanceState'> | string
      snapshotJson?: StringFilter<'AcceptanceState'> | string
      updatedAt?: DateTimeFilter<'AcceptanceState'> | Date | string
    },
    'id' | 'envId_projectCode'
  >

  export type AcceptanceStateOrderByWithAggregationInput = {
    id?: SortOrder
    envId?: SortOrder
    projectCode?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
    _count?: AcceptanceStateCountOrderByAggregateInput
    _avg?: AcceptanceStateAvgOrderByAggregateInput
    _max?: AcceptanceStateMaxOrderByAggregateInput
    _min?: AcceptanceStateMinOrderByAggregateInput
    _sum?: AcceptanceStateSumOrderByAggregateInput
  }

  export type AcceptanceStateScalarWhereWithAggregatesInput = {
    AND?:
      | AcceptanceStateScalarWhereWithAggregatesInput
      | AcceptanceStateScalarWhereWithAggregatesInput[]
    OR?: AcceptanceStateScalarWhereWithAggregatesInput[]
    NOT?:
      | AcceptanceStateScalarWhereWithAggregatesInput
      | AcceptanceStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'AcceptanceState'> | number
    envId?: StringWithAggregatesFilter<'AcceptanceState'> | string
    projectCode?: StringWithAggregatesFilter<'AcceptanceState'> | string
    snapshotJson?: StringWithAggregatesFilter<'AcceptanceState'> | string
    updatedAt?: DateTimeWithAggregatesFilter<'AcceptanceState'> | Date | string
  }

  export type SettlementStateWhereInput = {
    AND?: SettlementStateWhereInput | SettlementStateWhereInput[]
    OR?: SettlementStateWhereInput[]
    NOT?: SettlementStateWhereInput | SettlementStateWhereInput[]
    id?: IntFilter<'SettlementState'> | number
    envId?: StringFilter<'SettlementState'> | string
    snapshotJson?: StringFilter<'SettlementState'> | string
    updatedAt?: DateTimeFilter<'SettlementState'> | Date | string
  }

  export type SettlementStateOrderByWithRelationInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementStateWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      envId?: string
      AND?: SettlementStateWhereInput | SettlementStateWhereInput[]
      OR?: SettlementStateWhereInput[]
      NOT?: SettlementStateWhereInput | SettlementStateWhereInput[]
      snapshotJson?: StringFilter<'SettlementState'> | string
      updatedAt?: DateTimeFilter<'SettlementState'> | Date | string
    },
    'id' | 'envId'
  >

  export type SettlementStateOrderByWithAggregationInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
    _count?: SettlementStateCountOrderByAggregateInput
    _avg?: SettlementStateAvgOrderByAggregateInput
    _max?: SettlementStateMaxOrderByAggregateInput
    _min?: SettlementStateMinOrderByAggregateInput
    _sum?: SettlementStateSumOrderByAggregateInput
  }

  export type SettlementStateScalarWhereWithAggregatesInput = {
    AND?:
      | SettlementStateScalarWhereWithAggregatesInput
      | SettlementStateScalarWhereWithAggregatesInput[]
    OR?: SettlementStateScalarWhereWithAggregatesInput[]
    NOT?:
      | SettlementStateScalarWhereWithAggregatesInput
      | SettlementStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'SettlementState'> | number
    envId?: StringWithAggregatesFilter<'SettlementState'> | string
    snapshotJson?: StringWithAggregatesFilter<'SettlementState'> | string
    updatedAt?: DateTimeWithAggregatesFilter<'SettlementState'> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: IntFilter<'AuditLog'> | number
    envId?: StringFilter<'AuditLog'> | string
    scene?: StringFilter<'AuditLog'> | string
    detail?: StringFilter<'AuditLog'> | string
    projectCode?: StringNullableFilter<'AuditLog'> | string | null
    at?: DateTimeFilter<'AuditLog'> | Date | string
    createdAt?: DateTimeFilter<'AuditLog'> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    envId?: SortOrder
    scene?: SortOrder
    detail?: SortOrder
    projectCode?: SortOrderInput | SortOrder
    at?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: AuditLogWhereInput | AuditLogWhereInput[]
      OR?: AuditLogWhereInput[]
      NOT?: AuditLogWhereInput | AuditLogWhereInput[]
      envId?: StringFilter<'AuditLog'> | string
      scene?: StringFilter<'AuditLog'> | string
      detail?: StringFilter<'AuditLog'> | string
      projectCode?: StringNullableFilter<'AuditLog'> | string | null
      at?: DateTimeFilter<'AuditLog'> | Date | string
      createdAt?: DateTimeFilter<'AuditLog'> | Date | string
    },
    'id'
  >

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    envId?: SortOrder
    scene?: SortOrder
    detail?: SortOrder
    projectCode?: SortOrderInput | SortOrder
    at?: SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'AuditLog'> | number
    envId?: StringWithAggregatesFilter<'AuditLog'> | string
    scene?: StringWithAggregatesFilter<'AuditLog'> | string
    detail?: StringWithAggregatesFilter<'AuditLog'> | string
    projectCode?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null
    at?: DateTimeWithAggregatesFilter<'AuditLog'> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<'AuditLog'> | Date | string
  }

  export type IdempotencyKeyWhereInput = {
    AND?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
    OR?: IdempotencyKeyWhereInput[]
    NOT?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
    key?: StringFilter<'IdempotencyKey'> | string
    scope?: StringFilter<'IdempotencyKey'> | string
    envId?: StringFilter<'IdempotencyKey'> | string
    requestHash?: StringFilter<'IdempotencyKey'> | string
    responseStatus?: IntFilter<'IdempotencyKey'> | number
    responseBody?: StringNullableFilter<'IdempotencyKey'> | string | null
    createdAt?: DateTimeFilter<'IdempotencyKey'> | Date | string
    expiredAt?: DateTimeFilter<'IdempotencyKey'> | Date | string
  }

  export type IdempotencyKeyOrderByWithRelationInput = {
    key?: SortOrder
    scope?: SortOrder
    envId?: SortOrder
    requestHash?: SortOrder
    responseStatus?: SortOrder
    responseBody?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
  }

  export type IdempotencyKeyWhereUniqueInput = Prisma.AtLeast<
    {
      key?: string
      AND?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
      OR?: IdempotencyKeyWhereInput[]
      NOT?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
      scope?: StringFilter<'IdempotencyKey'> | string
      envId?: StringFilter<'IdempotencyKey'> | string
      requestHash?: StringFilter<'IdempotencyKey'> | string
      responseStatus?: IntFilter<'IdempotencyKey'> | number
      responseBody?: StringNullableFilter<'IdempotencyKey'> | string | null
      createdAt?: DateTimeFilter<'IdempotencyKey'> | Date | string
      expiredAt?: DateTimeFilter<'IdempotencyKey'> | Date | string
    },
    'key'
  >

  export type IdempotencyKeyOrderByWithAggregationInput = {
    key?: SortOrder
    scope?: SortOrder
    envId?: SortOrder
    requestHash?: SortOrder
    responseStatus?: SortOrder
    responseBody?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
    _count?: IdempotencyKeyCountOrderByAggregateInput
    _avg?: IdempotencyKeyAvgOrderByAggregateInput
    _max?: IdempotencyKeyMaxOrderByAggregateInput
    _min?: IdempotencyKeyMinOrderByAggregateInput
    _sum?: IdempotencyKeySumOrderByAggregateInput
  }

  export type IdempotencyKeyScalarWhereWithAggregatesInput = {
    AND?:
      | IdempotencyKeyScalarWhereWithAggregatesInput
      | IdempotencyKeyScalarWhereWithAggregatesInput[]
    OR?: IdempotencyKeyScalarWhereWithAggregatesInput[]
    NOT?:
      | IdempotencyKeyScalarWhereWithAggregatesInput
      | IdempotencyKeyScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<'IdempotencyKey'> | string
    scope?: StringWithAggregatesFilter<'IdempotencyKey'> | string
    envId?: StringWithAggregatesFilter<'IdempotencyKey'> | string
    requestHash?: StringWithAggregatesFilter<'IdempotencyKey'> | string
    responseStatus?: IntWithAggregatesFilter<'IdempotencyKey'> | number
    responseBody?: StringNullableWithAggregatesFilter<'IdempotencyKey'> | string | null
    createdAt?: DateTimeWithAggregatesFilter<'IdempotencyKey'> | Date | string
    expiredAt?: DateTimeWithAggregatesFilter<'IdempotencyKey'> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: IntFilter<'Project'> | number
    code?: StringFilter<'Project'> | string
    name?: StringFilter<'Project'> | string
    status?: StringFilter<'Project'> | string
    stage?: StringFilter<'Project'> | string
    progress?: IntFilter<'Project'> | number
    budget?: StringNullableFilter<'Project'> | string | null
    teamSize?: StringNullableFilter<'Project'> | string | null
    dateRange?: StringNullableFilter<'Project'> | string | null
    description?: StringNullableFilter<'Project'> | string | null
    owner?: StringNullableFilter<'Project'> | string | null
    riskLevel?: StringNullableFilter<'Project'> | string | null
    milestone?: StringNullableFilter<'Project'> | string | null
    tasks?: StringNullableFilter<'Project'> | string | null
    templateId?: StringNullableFilter<'Project'> | string | null
    dispatchStatus?: StringNullableFilter<'Project'> | string | null
    executionStatus?: StringNullableFilter<'Project'> | string | null
    acceptanceStatus?: StringNullableFilter<'Project'> | string | null
    settlementStatus?: StringNullableFilter<'Project'> | string | null
    pendingDispatchCount?: IntFilter<'Project'> | number
    pendingExecutionCount?: IntFilter<'Project'> | number
    pendingAcceptanceCount?: IntFilter<'Project'> | number
    createdAt?: DateTimeFilter<'Project'> | Date | string
    updatedAt?: DateTimeFilter<'Project'> | Date | string
    phases?: ProjectPhaseListRelationFilter
    milestones?: ProjectMilestoneListRelationFilter
    taskTree?: ProjectTaskListRelationFilter
    risks?: ProjectRiskListRelationFilter
    members?: ProjectMemberListRelationFilter
    statusLogs?: ProjectStatusLogListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    progress?: SortOrder
    budget?: SortOrderInput | SortOrder
    teamSize?: SortOrderInput | SortOrder
    dateRange?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    riskLevel?: SortOrderInput | SortOrder
    milestone?: SortOrderInput | SortOrder
    tasks?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    dispatchStatus?: SortOrderInput | SortOrder
    executionStatus?: SortOrderInput | SortOrder
    acceptanceStatus?: SortOrderInput | SortOrder
    settlementStatus?: SortOrderInput | SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    phases?: ProjectPhaseOrderByRelationAggregateInput
    milestones?: ProjectMilestoneOrderByRelationAggregateInput
    taskTree?: ProjectTaskOrderByRelationAggregateInput
    risks?: ProjectRiskOrderByRelationAggregateInput
    members?: ProjectMemberOrderByRelationAggregateInput
    statusLogs?: ProjectStatusLogOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      code?: string
      AND?: ProjectWhereInput | ProjectWhereInput[]
      OR?: ProjectWhereInput[]
      NOT?: ProjectWhereInput | ProjectWhereInput[]
      name?: StringFilter<'Project'> | string
      status?: StringFilter<'Project'> | string
      stage?: StringFilter<'Project'> | string
      progress?: IntFilter<'Project'> | number
      budget?: StringNullableFilter<'Project'> | string | null
      teamSize?: StringNullableFilter<'Project'> | string | null
      dateRange?: StringNullableFilter<'Project'> | string | null
      description?: StringNullableFilter<'Project'> | string | null
      owner?: StringNullableFilter<'Project'> | string | null
      riskLevel?: StringNullableFilter<'Project'> | string | null
      milestone?: StringNullableFilter<'Project'> | string | null
      tasks?: StringNullableFilter<'Project'> | string | null
      templateId?: StringNullableFilter<'Project'> | string | null
      dispatchStatus?: StringNullableFilter<'Project'> | string | null
      executionStatus?: StringNullableFilter<'Project'> | string | null
      acceptanceStatus?: StringNullableFilter<'Project'> | string | null
      settlementStatus?: StringNullableFilter<'Project'> | string | null
      pendingDispatchCount?: IntFilter<'Project'> | number
      pendingExecutionCount?: IntFilter<'Project'> | number
      pendingAcceptanceCount?: IntFilter<'Project'> | number
      createdAt?: DateTimeFilter<'Project'> | Date | string
      updatedAt?: DateTimeFilter<'Project'> | Date | string
      phases?: ProjectPhaseListRelationFilter
      milestones?: ProjectMilestoneListRelationFilter
      taskTree?: ProjectTaskListRelationFilter
      risks?: ProjectRiskListRelationFilter
      members?: ProjectMemberListRelationFilter
      statusLogs?: ProjectStatusLogListRelationFilter
    },
    'id' | 'code'
  >

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    progress?: SortOrder
    budget?: SortOrderInput | SortOrder
    teamSize?: SortOrderInput | SortOrder
    dateRange?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    riskLevel?: SortOrderInput | SortOrder
    milestone?: SortOrderInput | SortOrder
    tasks?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    dispatchStatus?: SortOrderInput | SortOrder
    executionStatus?: SortOrderInput | SortOrder
    acceptanceStatus?: SortOrderInput | SortOrder
    settlementStatus?: SortOrderInput | SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'Project'> | number
    code?: StringWithAggregatesFilter<'Project'> | string
    name?: StringWithAggregatesFilter<'Project'> | string
    status?: StringWithAggregatesFilter<'Project'> | string
    stage?: StringWithAggregatesFilter<'Project'> | string
    progress?: IntWithAggregatesFilter<'Project'> | number
    budget?: StringNullableWithAggregatesFilter<'Project'> | string | null
    teamSize?: StringNullableWithAggregatesFilter<'Project'> | string | null
    dateRange?: StringNullableWithAggregatesFilter<'Project'> | string | null
    description?: StringNullableWithAggregatesFilter<'Project'> | string | null
    owner?: StringNullableWithAggregatesFilter<'Project'> | string | null
    riskLevel?: StringNullableWithAggregatesFilter<'Project'> | string | null
    milestone?: StringNullableWithAggregatesFilter<'Project'> | string | null
    tasks?: StringNullableWithAggregatesFilter<'Project'> | string | null
    templateId?: StringNullableWithAggregatesFilter<'Project'> | string | null
    dispatchStatus?: StringNullableWithAggregatesFilter<'Project'> | string | null
    executionStatus?: StringNullableWithAggregatesFilter<'Project'> | string | null
    acceptanceStatus?: StringNullableWithAggregatesFilter<'Project'> | string | null
    settlementStatus?: StringNullableWithAggregatesFilter<'Project'> | string | null
    pendingDispatchCount?: IntWithAggregatesFilter<'Project'> | number
    pendingExecutionCount?: IntWithAggregatesFilter<'Project'> | number
    pendingAcceptanceCount?: IntWithAggregatesFilter<'Project'> | number
    createdAt?: DateTimeWithAggregatesFilter<'Project'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'Project'> | Date | string
  }

  export type ProjectPhaseWhereInput = {
    AND?: ProjectPhaseWhereInput | ProjectPhaseWhereInput[]
    OR?: ProjectPhaseWhereInput[]
    NOT?: ProjectPhaseWhereInput | ProjectPhaseWhereInput[]
    id?: IntFilter<'ProjectPhase'> | number
    projectId?: IntFilter<'ProjectPhase'> | number
    name?: StringFilter<'ProjectPhase'> | string
    startDate?: StringFilter<'ProjectPhase'> | string
    endDate?: StringFilter<'ProjectPhase'> | string
    progress?: IntFilter<'ProjectPhase'> | number
    status?: StringFilter<'ProjectPhase'> | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectPhaseOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectPhaseWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: ProjectPhaseWhereInput | ProjectPhaseWhereInput[]
      OR?: ProjectPhaseWhereInput[]
      NOT?: ProjectPhaseWhereInput | ProjectPhaseWhereInput[]
      projectId?: IntFilter<'ProjectPhase'> | number
      name?: StringFilter<'ProjectPhase'> | string
      startDate?: StringFilter<'ProjectPhase'> | string
      endDate?: StringFilter<'ProjectPhase'> | string
      progress?: IntFilter<'ProjectPhase'> | number
      status?: StringFilter<'ProjectPhase'> | string
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    },
    'id'
  >

  export type ProjectPhaseOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    _count?: ProjectPhaseCountOrderByAggregateInput
    _avg?: ProjectPhaseAvgOrderByAggregateInput
    _max?: ProjectPhaseMaxOrderByAggregateInput
    _min?: ProjectPhaseMinOrderByAggregateInput
    _sum?: ProjectPhaseSumOrderByAggregateInput
  }

  export type ProjectPhaseScalarWhereWithAggregatesInput = {
    AND?: ProjectPhaseScalarWhereWithAggregatesInput | ProjectPhaseScalarWhereWithAggregatesInput[]
    OR?: ProjectPhaseScalarWhereWithAggregatesInput[]
    NOT?: ProjectPhaseScalarWhereWithAggregatesInput | ProjectPhaseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectPhase'> | number
    projectId?: IntWithAggregatesFilter<'ProjectPhase'> | number
    name?: StringWithAggregatesFilter<'ProjectPhase'> | string
    startDate?: StringWithAggregatesFilter<'ProjectPhase'> | string
    endDate?: StringWithAggregatesFilter<'ProjectPhase'> | string
    progress?: IntWithAggregatesFilter<'ProjectPhase'> | number
    status?: StringWithAggregatesFilter<'ProjectPhase'> | string
  }

  export type ProjectMilestoneWhereInput = {
    AND?: ProjectMilestoneWhereInput | ProjectMilestoneWhereInput[]
    OR?: ProjectMilestoneWhereInput[]
    NOT?: ProjectMilestoneWhereInput | ProjectMilestoneWhereInput[]
    id?: IntFilter<'ProjectMilestone'> | number
    projectId?: IntFilter<'ProjectMilestone'> | number
    name?: StringFilter<'ProjectMilestone'> | string
    dueDate?: StringFilter<'ProjectMilestone'> | string
    status?: StringFilter<'ProjectMilestone'> | string
    assignee?: StringNullableFilter<'ProjectMilestone'> | string | null
    completedDate?: StringNullableFilter<'ProjectMilestone'> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectMilestoneOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    assignee?: SortOrderInput | SortOrder
    completedDate?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectMilestoneWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: ProjectMilestoneWhereInput | ProjectMilestoneWhereInput[]
      OR?: ProjectMilestoneWhereInput[]
      NOT?: ProjectMilestoneWhereInput | ProjectMilestoneWhereInput[]
      projectId?: IntFilter<'ProjectMilestone'> | number
      name?: StringFilter<'ProjectMilestone'> | string
      dueDate?: StringFilter<'ProjectMilestone'> | string
      status?: StringFilter<'ProjectMilestone'> | string
      assignee?: StringNullableFilter<'ProjectMilestone'> | string | null
      completedDate?: StringNullableFilter<'ProjectMilestone'> | string | null
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    },
    'id'
  >

  export type ProjectMilestoneOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    assignee?: SortOrderInput | SortOrder
    completedDate?: SortOrderInput | SortOrder
    _count?: ProjectMilestoneCountOrderByAggregateInput
    _avg?: ProjectMilestoneAvgOrderByAggregateInput
    _max?: ProjectMilestoneMaxOrderByAggregateInput
    _min?: ProjectMilestoneMinOrderByAggregateInput
    _sum?: ProjectMilestoneSumOrderByAggregateInput
  }

  export type ProjectMilestoneScalarWhereWithAggregatesInput = {
    AND?:
      | ProjectMilestoneScalarWhereWithAggregatesInput
      | ProjectMilestoneScalarWhereWithAggregatesInput[]
    OR?: ProjectMilestoneScalarWhereWithAggregatesInput[]
    NOT?:
      | ProjectMilestoneScalarWhereWithAggregatesInput
      | ProjectMilestoneScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectMilestone'> | number
    projectId?: IntWithAggregatesFilter<'ProjectMilestone'> | number
    name?: StringWithAggregatesFilter<'ProjectMilestone'> | string
    dueDate?: StringWithAggregatesFilter<'ProjectMilestone'> | string
    status?: StringWithAggregatesFilter<'ProjectMilestone'> | string
    assignee?: StringNullableWithAggregatesFilter<'ProjectMilestone'> | string | null
    completedDate?: StringNullableWithAggregatesFilter<'ProjectMilestone'> | string | null
  }

  export type ProjectTaskWhereInput = {
    AND?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
    OR?: ProjectTaskWhereInput[]
    NOT?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
    id?: IntFilter<'ProjectTask'> | number
    projectId?: IntFilter<'ProjectTask'> | number
    code?: StringFilter<'ProjectTask'> | string
    name?: StringFilter<'ProjectTask'> | string
    status?: StringFilter<'ProjectTask'> | string
    assignee?: StringNullableFilter<'ProjectTask'> | string | null
    startDate?: StringNullableFilter<'ProjectTask'> | string | null
    endDate?: StringNullableFilter<'ProjectTask'> | string | null
    progress?: IntFilter<'ProjectTask'> | number
    parentId?: IntNullableFilter<'ProjectTask'> | number | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectTaskOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    assignee?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    progress?: SortOrder
    parentId?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectTaskWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
      OR?: ProjectTaskWhereInput[]
      NOT?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
      projectId?: IntFilter<'ProjectTask'> | number
      code?: StringFilter<'ProjectTask'> | string
      name?: StringFilter<'ProjectTask'> | string
      status?: StringFilter<'ProjectTask'> | string
      assignee?: StringNullableFilter<'ProjectTask'> | string | null
      startDate?: StringNullableFilter<'ProjectTask'> | string | null
      endDate?: StringNullableFilter<'ProjectTask'> | string | null
      progress?: IntFilter<'ProjectTask'> | number
      parentId?: IntNullableFilter<'ProjectTask'> | number | null
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    },
    'id'
  >

  export type ProjectTaskOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    assignee?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    progress?: SortOrder
    parentId?: SortOrderInput | SortOrder
    _count?: ProjectTaskCountOrderByAggregateInput
    _avg?: ProjectTaskAvgOrderByAggregateInput
    _max?: ProjectTaskMaxOrderByAggregateInput
    _min?: ProjectTaskMinOrderByAggregateInput
    _sum?: ProjectTaskSumOrderByAggregateInput
  }

  export type ProjectTaskScalarWhereWithAggregatesInput = {
    AND?: ProjectTaskScalarWhereWithAggregatesInput | ProjectTaskScalarWhereWithAggregatesInput[]
    OR?: ProjectTaskScalarWhereWithAggregatesInput[]
    NOT?: ProjectTaskScalarWhereWithAggregatesInput | ProjectTaskScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectTask'> | number
    projectId?: IntWithAggregatesFilter<'ProjectTask'> | number
    code?: StringWithAggregatesFilter<'ProjectTask'> | string
    name?: StringWithAggregatesFilter<'ProjectTask'> | string
    status?: StringWithAggregatesFilter<'ProjectTask'> | string
    assignee?: StringNullableWithAggregatesFilter<'ProjectTask'> | string | null
    startDate?: StringNullableWithAggregatesFilter<'ProjectTask'> | string | null
    endDate?: StringNullableWithAggregatesFilter<'ProjectTask'> | string | null
    progress?: IntWithAggregatesFilter<'ProjectTask'> | number
    parentId?: IntNullableWithAggregatesFilter<'ProjectTask'> | number | null
  }

  export type ProjectRiskWhereInput = {
    AND?: ProjectRiskWhereInput | ProjectRiskWhereInput[]
    OR?: ProjectRiskWhereInput[]
    NOT?: ProjectRiskWhereInput | ProjectRiskWhereInput[]
    id?: IntFilter<'ProjectRisk'> | number
    projectId?: IntFilter<'ProjectRisk'> | number
    title?: StringFilter<'ProjectRisk'> | string
    level?: StringFilter<'ProjectRisk'> | string
    probability?: StringNullableFilter<'ProjectRisk'> | string | null
    impact?: StringNullableFilter<'ProjectRisk'> | string | null
    mitigation?: StringNullableFilter<'ProjectRisk'> | string | null
    status?: StringFilter<'ProjectRisk'> | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectRiskOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    level?: SortOrder
    probability?: SortOrderInput | SortOrder
    impact?: SortOrderInput | SortOrder
    mitigation?: SortOrderInput | SortOrder
    status?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectRiskWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: ProjectRiskWhereInput | ProjectRiskWhereInput[]
      OR?: ProjectRiskWhereInput[]
      NOT?: ProjectRiskWhereInput | ProjectRiskWhereInput[]
      projectId?: IntFilter<'ProjectRisk'> | number
      title?: StringFilter<'ProjectRisk'> | string
      level?: StringFilter<'ProjectRisk'> | string
      probability?: StringNullableFilter<'ProjectRisk'> | string | null
      impact?: StringNullableFilter<'ProjectRisk'> | string | null
      mitigation?: StringNullableFilter<'ProjectRisk'> | string | null
      status?: StringFilter<'ProjectRisk'> | string
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    },
    'id'
  >

  export type ProjectRiskOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    level?: SortOrder
    probability?: SortOrderInput | SortOrder
    impact?: SortOrderInput | SortOrder
    mitigation?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: ProjectRiskCountOrderByAggregateInput
    _avg?: ProjectRiskAvgOrderByAggregateInput
    _max?: ProjectRiskMaxOrderByAggregateInput
    _min?: ProjectRiskMinOrderByAggregateInput
    _sum?: ProjectRiskSumOrderByAggregateInput
  }

  export type ProjectRiskScalarWhereWithAggregatesInput = {
    AND?: ProjectRiskScalarWhereWithAggregatesInput | ProjectRiskScalarWhereWithAggregatesInput[]
    OR?: ProjectRiskScalarWhereWithAggregatesInput[]
    NOT?: ProjectRiskScalarWhereWithAggregatesInput | ProjectRiskScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectRisk'> | number
    projectId?: IntWithAggregatesFilter<'ProjectRisk'> | number
    title?: StringWithAggregatesFilter<'ProjectRisk'> | string
    level?: StringWithAggregatesFilter<'ProjectRisk'> | string
    probability?: StringNullableWithAggregatesFilter<'ProjectRisk'> | string | null
    impact?: StringNullableWithAggregatesFilter<'ProjectRisk'> | string | null
    mitigation?: StringNullableWithAggregatesFilter<'ProjectRisk'> | string | null
    status?: StringWithAggregatesFilter<'ProjectRisk'> | string
  }

  export type ProjectMemberWhereInput = {
    AND?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    OR?: ProjectMemberWhereInput[]
    NOT?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    id?: IntFilter<'ProjectMember'> | number
    projectId?: IntFilter<'ProjectMember'> | number
    userId?: StringFilter<'ProjectMember'> | string
    name?: StringFilter<'ProjectMember'> | string
    role?: StringFilter<'ProjectMember'> | string
    avatar?: StringNullableFilter<'ProjectMember'> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectMemberOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectMemberWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
      OR?: ProjectMemberWhereInput[]
      NOT?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
      projectId?: IntFilter<'ProjectMember'> | number
      userId?: StringFilter<'ProjectMember'> | string
      name?: StringFilter<'ProjectMember'> | string
      role?: StringFilter<'ProjectMember'> | string
      avatar?: StringNullableFilter<'ProjectMember'> | string | null
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    },
    'id'
  >

  export type ProjectMemberOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    _count?: ProjectMemberCountOrderByAggregateInput
    _avg?: ProjectMemberAvgOrderByAggregateInput
    _max?: ProjectMemberMaxOrderByAggregateInput
    _min?: ProjectMemberMinOrderByAggregateInput
    _sum?: ProjectMemberSumOrderByAggregateInput
  }

  export type ProjectMemberScalarWhereWithAggregatesInput = {
    AND?:
      | ProjectMemberScalarWhereWithAggregatesInput
      | ProjectMemberScalarWhereWithAggregatesInput[]
    OR?: ProjectMemberScalarWhereWithAggregatesInput[]
    NOT?:
      | ProjectMemberScalarWhereWithAggregatesInput
      | ProjectMemberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectMember'> | number
    projectId?: IntWithAggregatesFilter<'ProjectMember'> | number
    userId?: StringWithAggregatesFilter<'ProjectMember'> | string
    name?: StringWithAggregatesFilter<'ProjectMember'> | string
    role?: StringWithAggregatesFilter<'ProjectMember'> | string
    avatar?: StringNullableWithAggregatesFilter<'ProjectMember'> | string | null
  }

  export type ProjectStatusLogWhereInput = {
    AND?: ProjectStatusLogWhereInput | ProjectStatusLogWhereInput[]
    OR?: ProjectStatusLogWhereInput[]
    NOT?: ProjectStatusLogWhereInput | ProjectStatusLogWhereInput[]
    id?: IntFilter<'ProjectStatusLog'> | number
    projectId?: IntFilter<'ProjectStatusLog'> | number
    type?: StringFilter<'ProjectStatusLog'> | string
    at?: DateTimeFilter<'ProjectStatusLog'> | Date | string
    operator?: StringFilter<'ProjectStatusLog'> | string
    message?: StringFilter<'ProjectStatusLog'> | string
    fromStatus?: StringNullableFilter<'ProjectStatusLog'> | string | null
    toStatus?: StringNullableFilter<'ProjectStatusLog'> | string | null
    reason?: StringNullableFilter<'ProjectStatusLog'> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectStatusLogOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    at?: SortOrder
    operator?: SortOrder
    message?: SortOrder
    fromStatus?: SortOrderInput | SortOrder
    toStatus?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectStatusLogWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number
      AND?: ProjectStatusLogWhereInput | ProjectStatusLogWhereInput[]
      OR?: ProjectStatusLogWhereInput[]
      NOT?: ProjectStatusLogWhereInput | ProjectStatusLogWhereInput[]
      projectId?: IntFilter<'ProjectStatusLog'> | number
      type?: StringFilter<'ProjectStatusLog'> | string
      at?: DateTimeFilter<'ProjectStatusLog'> | Date | string
      operator?: StringFilter<'ProjectStatusLog'> | string
      message?: StringFilter<'ProjectStatusLog'> | string
      fromStatus?: StringNullableFilter<'ProjectStatusLog'> | string | null
      toStatus?: StringNullableFilter<'ProjectStatusLog'> | string | null
      reason?: StringNullableFilter<'ProjectStatusLog'> | string | null
      project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    },
    'id'
  >

  export type ProjectStatusLogOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    at?: SortOrder
    operator?: SortOrder
    message?: SortOrder
    fromStatus?: SortOrderInput | SortOrder
    toStatus?: SortOrderInput | SortOrder
    reason?: SortOrderInput | SortOrder
    _count?: ProjectStatusLogCountOrderByAggregateInput
    _avg?: ProjectStatusLogAvgOrderByAggregateInput
    _max?: ProjectStatusLogMaxOrderByAggregateInput
    _min?: ProjectStatusLogMinOrderByAggregateInput
    _sum?: ProjectStatusLogSumOrderByAggregateInput
  }

  export type ProjectStatusLogScalarWhereWithAggregatesInput = {
    AND?:
      | ProjectStatusLogScalarWhereWithAggregatesInput
      | ProjectStatusLogScalarWhereWithAggregatesInput[]
    OR?: ProjectStatusLogScalarWhereWithAggregatesInput[]
    NOT?:
      | ProjectStatusLogScalarWhereWithAggregatesInput
      | ProjectStatusLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<'ProjectStatusLog'> | number
    projectId?: IntWithAggregatesFilter<'ProjectStatusLog'> | number
    type?: StringWithAggregatesFilter<'ProjectStatusLog'> | string
    at?: DateTimeWithAggregatesFilter<'ProjectStatusLog'> | Date | string
    operator?: StringWithAggregatesFilter<'ProjectStatusLog'> | string
    message?: StringWithAggregatesFilter<'ProjectStatusLog'> | string
    fromStatus?: StringNullableWithAggregatesFilter<'ProjectStatusLog'> | string | null
    toStatus?: StringNullableWithAggregatesFilter<'ProjectStatusLog'> | string | null
    reason?: StringNullableWithAggregatesFilter<'ProjectStatusLog'> | string | null
  }

  export type ProjectStateCreateInput = {
    envId: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type ProjectStateUncheckedCreateInput = {
    id?: number
    envId: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type ProjectStateUpdateInput = {
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectStateCreateManyInput = {
    id?: number
    envId: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type ProjectStateUpdateManyMutationInput = {
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskStateCreateInput = {
    envId: string
    contextKey: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type TaskStateUncheckedCreateInput = {
    id?: number
    envId: string
    contextKey: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type TaskStateUpdateInput = {
    envId?: StringFieldUpdateOperationsInput | string
    contextKey?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    contextKey?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskStateCreateManyInput = {
    id?: number
    envId: string
    contextKey: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type TaskStateUpdateManyMutationInput = {
    envId?: StringFieldUpdateOperationsInput | string
    contextKey?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    contextKey?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcceptanceStateCreateInput = {
    envId: string
    projectCode: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type AcceptanceStateUncheckedCreateInput = {
    id?: number
    envId: string
    projectCode: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type AcceptanceStateUpdateInput = {
    envId?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcceptanceStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcceptanceStateCreateManyInput = {
    id?: number
    envId: string
    projectCode: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type AcceptanceStateUpdateManyMutationInput = {
    envId?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcceptanceStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    projectCode?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementStateCreateInput = {
    envId: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type SettlementStateUncheckedCreateInput = {
    id?: number
    envId: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type SettlementStateUpdateInput = {
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementStateCreateManyInput = {
    id?: number
    envId: string
    snapshotJson: string
    updatedAt?: Date | string
  }

  export type SettlementStateUpdateManyMutationInput = {
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettlementStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    envId: string
    scene: string
    detail: string
    projectCode?: string | null
    at: Date | string
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: number
    envId: string
    scene: string
    detail: string
    projectCode?: string | null
    at: Date | string
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    envId?: StringFieldUpdateOperationsInput | string
    scene?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    projectCode?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    scene?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    projectCode?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: number
    envId: string
    scene: string
    detail: string
    projectCode?: string | null
    at: Date | string
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    envId?: StringFieldUpdateOperationsInput | string
    scene?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    projectCode?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    envId?: StringFieldUpdateOperationsInput | string
    scene?: StringFieldUpdateOperationsInput | string
    detail?: StringFieldUpdateOperationsInput | string
    projectCode?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyCreateInput = {
    key: string
    scope: string
    envId: string
    requestHash: string
    responseStatus: number
    responseBody?: string | null
    createdAt?: Date | string
    expiredAt: Date | string
  }

  export type IdempotencyKeyUncheckedCreateInput = {
    key: string
    scope: string
    envId: string
    requestHash: string
    responseStatus: number
    responseBody?: string | null
    createdAt?: Date | string
    expiredAt: Date | string
  }

  export type IdempotencyKeyUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    envId?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseStatus?: IntFieldUpdateOperationsInput | number
    responseBody?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    envId?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseStatus?: IntFieldUpdateOperationsInput | number
    responseBody?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyCreateManyInput = {
    key: string
    scope: string
    envId: string
    requestHash: string
    responseStatus: number
    responseBody?: string | null
    createdAt?: Date | string
    expiredAt: Date | string
  }

  export type IdempotencyKeyUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    envId?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseStatus?: IntFieldUpdateOperationsInput | number
    responseBody?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    envId?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseStatus?: IntFieldUpdateOperationsInput | number
    responseBody?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectPhaseCreateInput = {
    name: string
    startDate: string
    endDate: string
    progress?: number
    status: string
    project: ProjectCreateNestedOneWithoutPhasesInput
  }

  export type ProjectPhaseUncheckedCreateInput = {
    id?: number
    projectId: number
    name: string
    startDate: string
    endDate: string
    progress?: number
    status: string
  }

  export type ProjectPhaseUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    project?: ProjectUpdateOneRequiredWithoutPhasesNestedInput
  }

  export type ProjectPhaseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectPhaseCreateManyInput = {
    id?: number
    projectId: number
    name: string
    startDate: string
    endDate: string
    progress?: number
    status: string
  }

  export type ProjectPhaseUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectPhaseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectMilestoneCreateInput = {
    name: string
    dueDate: string
    status: string
    assignee?: string | null
    completedDate?: string | null
    project: ProjectCreateNestedOneWithoutMilestonesInput
  }

  export type ProjectMilestoneUncheckedCreateInput = {
    id?: number
    projectId: number
    name: string
    dueDate: string
    status: string
    assignee?: string | null
    completedDate?: string | null
  }

  export type ProjectMilestoneUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
    project?: ProjectUpdateOneRequiredWithoutMilestonesNestedInput
  }

  export type ProjectMilestoneUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMilestoneCreateManyInput = {
    id?: number
    projectId: number
    name: string
    dueDate: string
    status: string
    assignee?: string | null
    completedDate?: string | null
  }

  export type ProjectMilestoneUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMilestoneUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectTaskCreateInput = {
    code: string
    name: string
    status: string
    assignee?: string | null
    startDate?: string | null
    endDate?: string | null
    progress?: number
    parentId?: number | null
    project: ProjectCreateNestedOneWithoutTaskTreeInput
  }

  export type ProjectTaskUncheckedCreateInput = {
    id?: number
    projectId: number
    code: string
    name: string
    status: string
    assignee?: string | null
    startDate?: string | null
    endDate?: string | null
    progress?: number
    parentId?: number | null
  }

  export type ProjectTaskUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
    project?: ProjectUpdateOneRequiredWithoutTaskTreeNestedInput
  }

  export type ProjectTaskUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProjectTaskCreateManyInput = {
    id?: number
    projectId: number
    code: string
    name: string
    status: string
    assignee?: string | null
    startDate?: string | null
    endDate?: string | null
    progress?: number
    parentId?: number | null
  }

  export type ProjectTaskUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProjectTaskUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProjectRiskCreateInput = {
    title: string
    level: string
    probability?: string | null
    impact?: string | null
    mitigation?: string | null
    status: string
    project: ProjectCreateNestedOneWithoutRisksInput
  }

  export type ProjectRiskUncheckedCreateInput = {
    id?: number
    projectId: number
    title: string
    level: string
    probability?: string | null
    impact?: string | null
    mitigation?: string | null
    status: string
  }

  export type ProjectRiskUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    project?: ProjectUpdateOneRequiredWithoutRisksNestedInput
  }

  export type ProjectRiskUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectRiskCreateManyInput = {
    id?: number
    projectId: number
    title: string
    level: string
    probability?: string | null
    impact?: string | null
    mitigation?: string | null
    status: string
  }

  export type ProjectRiskUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectRiskUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectMemberCreateInput = {
    userId: string
    name: string
    role: string
    avatar?: string | null
    project: ProjectCreateNestedOneWithoutMembersInput
  }

  export type ProjectMemberUncheckedCreateInput = {
    id?: number
    projectId: number
    userId: string
    name: string
    role: string
    avatar?: string | null
  }

  export type ProjectMemberUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    project?: ProjectUpdateOneRequiredWithoutMembersNestedInput
  }

  export type ProjectMemberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMemberCreateManyInput = {
    id?: number
    projectId: number
    userId: string
    name: string
    role: string
    avatar?: string | null
  }

  export type ProjectMemberUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMemberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectStatusLogCreateInput = {
    type: string
    at: Date | string
    operator: string
    message: string
    fromStatus?: string | null
    toStatus?: string | null
    reason?: string | null
    project: ProjectCreateNestedOneWithoutStatusLogsInput
  }

  export type ProjectStatusLogUncheckedCreateInput = {
    id?: number
    projectId: number
    type: string
    at: Date | string
    operator: string
    message: string
    fromStatus?: string | null
    toStatus?: string | null
    reason?: string | null
  }

  export type ProjectStatusLogUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    project?: ProjectUpdateOneRequiredWithoutStatusLogsNestedInput
  }

  export type ProjectStatusLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectStatusLogCreateManyInput = {
    id?: number
    projectId: number
    type: string
    at: Date | string
    operator: string
    message: string
    fromStatus?: string | null
    toStatus?: string | null
    reason?: string | null
  }

  export type ProjectStatusLogUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectStatusLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectStateCountOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectStateAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProjectStateMaxOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectStateMinOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectStateSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type TaskStateEnvIdContextKeyCompoundUniqueInput = {
    envId: string
    contextKey: string
  }

  export type TaskStateCountOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    contextKey?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskStateAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TaskStateMaxOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    contextKey?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskStateMinOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    contextKey?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskStateSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AcceptanceStateEnvIdProjectCodeCompoundUniqueInput = {
    envId: string
    projectCode: string
  }

  export type AcceptanceStateCountOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    projectCode?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type AcceptanceStateAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AcceptanceStateMaxOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    projectCode?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type AcceptanceStateMinOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    projectCode?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type AcceptanceStateSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SettlementStateCountOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementStateAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SettlementStateMaxOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementStateMinOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    snapshotJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettlementStateSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    scene?: SortOrder
    detail?: SortOrder
    projectCode?: SortOrder
    at?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    scene?: SortOrder
    detail?: SortOrder
    projectCode?: SortOrder
    at?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    envId?: SortOrder
    scene?: SortOrder
    detail?: SortOrder
    projectCode?: SortOrder
    at?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IdempotencyKeyCountOrderByAggregateInput = {
    key?: SortOrder
    scope?: SortOrder
    envId?: SortOrder
    requestHash?: SortOrder
    responseStatus?: SortOrder
    responseBody?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
  }

  export type IdempotencyKeyAvgOrderByAggregateInput = {
    responseStatus?: SortOrder
  }

  export type IdempotencyKeyMaxOrderByAggregateInput = {
    key?: SortOrder
    scope?: SortOrder
    envId?: SortOrder
    requestHash?: SortOrder
    responseStatus?: SortOrder
    responseBody?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
  }

  export type IdempotencyKeyMinOrderByAggregateInput = {
    key?: SortOrder
    scope?: SortOrder
    envId?: SortOrder
    requestHash?: SortOrder
    responseStatus?: SortOrder
    responseBody?: SortOrder
    createdAt?: SortOrder
    expiredAt?: SortOrder
  }

  export type IdempotencyKeySumOrderByAggregateInput = {
    responseStatus?: SortOrder
  }

  export type ProjectPhaseListRelationFilter = {
    every?: ProjectPhaseWhereInput
    some?: ProjectPhaseWhereInput
    none?: ProjectPhaseWhereInput
  }

  export type ProjectMilestoneListRelationFilter = {
    every?: ProjectMilestoneWhereInput
    some?: ProjectMilestoneWhereInput
    none?: ProjectMilestoneWhereInput
  }

  export type ProjectTaskListRelationFilter = {
    every?: ProjectTaskWhereInput
    some?: ProjectTaskWhereInput
    none?: ProjectTaskWhereInput
  }

  export type ProjectRiskListRelationFilter = {
    every?: ProjectRiskWhereInput
    some?: ProjectRiskWhereInput
    none?: ProjectRiskWhereInput
  }

  export type ProjectMemberListRelationFilter = {
    every?: ProjectMemberWhereInput
    some?: ProjectMemberWhereInput
    none?: ProjectMemberWhereInput
  }

  export type ProjectStatusLogListRelationFilter = {
    every?: ProjectStatusLogWhereInput
    some?: ProjectStatusLogWhereInput
    none?: ProjectStatusLogWhereInput
  }

  export type ProjectPhaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectMilestoneOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectTaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectRiskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectStatusLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    progress?: SortOrder
    budget?: SortOrder
    teamSize?: SortOrder
    dateRange?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    riskLevel?: SortOrder
    milestone?: SortOrder
    tasks?: SortOrder
    templateId?: SortOrder
    dispatchStatus?: SortOrder
    executionStatus?: SortOrder
    acceptanceStatus?: SortOrder
    settlementStatus?: SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    id?: SortOrder
    progress?: SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    progress?: SortOrder
    budget?: SortOrder
    teamSize?: SortOrder
    dateRange?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    riskLevel?: SortOrder
    milestone?: SortOrder
    tasks?: SortOrder
    templateId?: SortOrder
    dispatchStatus?: SortOrder
    executionStatus?: SortOrder
    acceptanceStatus?: SortOrder
    settlementStatus?: SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    stage?: SortOrder
    progress?: SortOrder
    budget?: SortOrder
    teamSize?: SortOrder
    dateRange?: SortOrder
    description?: SortOrder
    owner?: SortOrder
    riskLevel?: SortOrder
    milestone?: SortOrder
    tasks?: SortOrder
    templateId?: SortOrder
    dispatchStatus?: SortOrder
    executionStatus?: SortOrder
    acceptanceStatus?: SortOrder
    settlementStatus?: SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    id?: SortOrder
    progress?: SortOrder
    pendingDispatchCount?: SortOrder
    pendingExecutionCount?: SortOrder
    pendingAcceptanceCount?: SortOrder
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectPhaseCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    status?: SortOrder
  }

  export type ProjectPhaseAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    progress?: SortOrder
  }

  export type ProjectPhaseMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    status?: SortOrder
  }

  export type ProjectPhaseMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    status?: SortOrder
  }

  export type ProjectPhaseSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    progress?: SortOrder
  }

  export type ProjectMilestoneCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    assignee?: SortOrder
    completedDate?: SortOrder
  }

  export type ProjectMilestoneAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectMilestoneMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    assignee?: SortOrder
    completedDate?: SortOrder
  }

  export type ProjectMilestoneMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    dueDate?: SortOrder
    status?: SortOrder
    assignee?: SortOrder
    completedDate?: SortOrder
  }

  export type ProjectMilestoneSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ProjectTaskCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    assignee?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    parentId?: SortOrder
  }

  export type ProjectTaskAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    progress?: SortOrder
    parentId?: SortOrder
  }

  export type ProjectTaskMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    assignee?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    parentId?: SortOrder
  }

  export type ProjectTaskMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    assignee?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    progress?: SortOrder
    parentId?: SortOrder
  }

  export type ProjectTaskSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    progress?: SortOrder
    parentId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type ProjectRiskCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    level?: SortOrder
    probability?: SortOrder
    impact?: SortOrder
    mitigation?: SortOrder
    status?: SortOrder
  }

  export type ProjectRiskAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectRiskMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    level?: SortOrder
    probability?: SortOrder
    impact?: SortOrder
    mitigation?: SortOrder
    status?: SortOrder
  }

  export type ProjectRiskMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    level?: SortOrder
    probability?: SortOrder
    impact?: SortOrder
    mitigation?: SortOrder
    status?: SortOrder
  }

  export type ProjectRiskSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectMemberCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
  }

  export type ProjectMemberAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
  }

  export type ProjectMemberMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
  }

  export type ProjectMemberSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectStatusLogCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    at?: SortOrder
    operator?: SortOrder
    message?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
  }

  export type ProjectStatusLogAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectStatusLogMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    at?: SortOrder
    operator?: SortOrder
    message?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
  }

  export type ProjectStatusLogMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    at?: SortOrder
    operator?: SortOrder
    message?: SortOrder
    fromStatus?: SortOrder
    toStatus?: SortOrder
    reason?: SortOrder
  }

  export type ProjectStatusLogSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ProjectPhaseCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectPhaseCreateWithoutProjectInput, ProjectPhaseUncheckedCreateWithoutProjectInput>
      | ProjectPhaseCreateWithoutProjectInput[]
      | ProjectPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectPhaseCreateOrConnectWithoutProjectInput
      | ProjectPhaseCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectPhaseCreateManyProjectInputEnvelope
    connect?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
  }

  export type ProjectMilestoneCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          ProjectMilestoneCreateWithoutProjectInput,
          ProjectMilestoneUncheckedCreateWithoutProjectInput
        >
      | ProjectMilestoneCreateWithoutProjectInput[]
      | ProjectMilestoneUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMilestoneCreateOrConnectWithoutProjectInput
      | ProjectMilestoneCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMilestoneCreateManyProjectInputEnvelope
    connect?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
  }

  export type ProjectTaskCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
      | ProjectTaskCreateWithoutProjectInput[]
      | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectTaskCreateOrConnectWithoutProjectInput
      | ProjectTaskCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type ProjectRiskCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectRiskCreateWithoutProjectInput, ProjectRiskUncheckedCreateWithoutProjectInput>
      | ProjectRiskCreateWithoutProjectInput[]
      | ProjectRiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectRiskCreateOrConnectWithoutProjectInput
      | ProjectRiskCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectRiskCreateManyProjectInputEnvelope
    connect?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
  }

  export type ProjectMemberCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
      | ProjectMemberCreateWithoutProjectInput[]
      | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMemberCreateOrConnectWithoutProjectInput
      | ProjectMemberCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type ProjectStatusLogCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          ProjectStatusLogCreateWithoutProjectInput,
          ProjectStatusLogUncheckedCreateWithoutProjectInput
        >
      | ProjectStatusLogCreateWithoutProjectInput[]
      | ProjectStatusLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectStatusLogCreateOrConnectWithoutProjectInput
      | ProjectStatusLogCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectStatusLogCreateManyProjectInputEnvelope
    connect?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
  }

  export type ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectPhaseCreateWithoutProjectInput, ProjectPhaseUncheckedCreateWithoutProjectInput>
      | ProjectPhaseCreateWithoutProjectInput[]
      | ProjectPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectPhaseCreateOrConnectWithoutProjectInput
      | ProjectPhaseCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectPhaseCreateManyProjectInputEnvelope
    connect?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
  }

  export type ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          ProjectMilestoneCreateWithoutProjectInput,
          ProjectMilestoneUncheckedCreateWithoutProjectInput
        >
      | ProjectMilestoneCreateWithoutProjectInput[]
      | ProjectMilestoneUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMilestoneCreateOrConnectWithoutProjectInput
      | ProjectMilestoneCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMilestoneCreateManyProjectInputEnvelope
    connect?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
  }

  export type ProjectTaskUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
      | ProjectTaskCreateWithoutProjectInput[]
      | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectTaskCreateOrConnectWithoutProjectInput
      | ProjectTaskCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type ProjectRiskUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectRiskCreateWithoutProjectInput, ProjectRiskUncheckedCreateWithoutProjectInput>
      | ProjectRiskCreateWithoutProjectInput[]
      | ProjectRiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectRiskCreateOrConnectWithoutProjectInput
      | ProjectRiskCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectRiskCreateManyProjectInputEnvelope
    connect?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
  }

  export type ProjectMemberUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
      | ProjectMemberCreateWithoutProjectInput[]
      | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMemberCreateOrConnectWithoutProjectInput
      | ProjectMemberCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput = {
    create?:
      | XOR<
          ProjectStatusLogCreateWithoutProjectInput,
          ProjectStatusLogUncheckedCreateWithoutProjectInput
        >
      | ProjectStatusLogCreateWithoutProjectInput[]
      | ProjectStatusLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectStatusLogCreateOrConnectWithoutProjectInput
      | ProjectStatusLogCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectStatusLogCreateManyProjectInputEnvelope
    connect?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
  }

  export type ProjectPhaseUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectPhaseCreateWithoutProjectInput, ProjectPhaseUncheckedCreateWithoutProjectInput>
      | ProjectPhaseCreateWithoutProjectInput[]
      | ProjectPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectPhaseCreateOrConnectWithoutProjectInput
      | ProjectPhaseCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectPhaseUpsertWithWhereUniqueWithoutProjectInput
      | ProjectPhaseUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectPhaseCreateManyProjectInputEnvelope
    set?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    disconnect?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    delete?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    connect?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    update?:
      | ProjectPhaseUpdateWithWhereUniqueWithoutProjectInput
      | ProjectPhaseUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectPhaseUpdateManyWithWhereWithoutProjectInput
      | ProjectPhaseUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectPhaseScalarWhereInput | ProjectPhaseScalarWhereInput[]
  }

  export type ProjectMilestoneUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          ProjectMilestoneCreateWithoutProjectInput,
          ProjectMilestoneUncheckedCreateWithoutProjectInput
        >
      | ProjectMilestoneCreateWithoutProjectInput[]
      | ProjectMilestoneUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMilestoneCreateOrConnectWithoutProjectInput
      | ProjectMilestoneCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectMilestoneUpsertWithWhereUniqueWithoutProjectInput
      | ProjectMilestoneUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMilestoneCreateManyProjectInputEnvelope
    set?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    disconnect?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    delete?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    connect?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    update?:
      | ProjectMilestoneUpdateWithWhereUniqueWithoutProjectInput
      | ProjectMilestoneUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectMilestoneUpdateManyWithWhereWithoutProjectInput
      | ProjectMilestoneUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMilestoneScalarWhereInput | ProjectMilestoneScalarWhereInput[]
  }

  export type ProjectTaskUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
      | ProjectTaskCreateWithoutProjectInput[]
      | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectTaskCreateOrConnectWithoutProjectInput
      | ProjectTaskCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectTaskUpsertWithWhereUniqueWithoutProjectInput
      | ProjectTaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?:
      | ProjectTaskUpdateWithWhereUniqueWithoutProjectInput
      | ProjectTaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectTaskUpdateManyWithWhereWithoutProjectInput
      | ProjectTaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type ProjectRiskUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectRiskCreateWithoutProjectInput, ProjectRiskUncheckedCreateWithoutProjectInput>
      | ProjectRiskCreateWithoutProjectInput[]
      | ProjectRiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectRiskCreateOrConnectWithoutProjectInput
      | ProjectRiskCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectRiskUpsertWithWhereUniqueWithoutProjectInput
      | ProjectRiskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectRiskCreateManyProjectInputEnvelope
    set?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    disconnect?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    delete?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    connect?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    update?:
      | ProjectRiskUpdateWithWhereUniqueWithoutProjectInput
      | ProjectRiskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectRiskUpdateManyWithWhereWithoutProjectInput
      | ProjectRiskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectRiskScalarWhereInput | ProjectRiskScalarWhereInput[]
  }

  export type ProjectMemberUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
      | ProjectMemberCreateWithoutProjectInput[]
      | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMemberCreateOrConnectWithoutProjectInput
      | ProjectMemberCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput
      | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?:
      | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput
      | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectMemberUpdateManyWithWhereWithoutProjectInput
      | ProjectMemberUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type ProjectStatusLogUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          ProjectStatusLogCreateWithoutProjectInput,
          ProjectStatusLogUncheckedCreateWithoutProjectInput
        >
      | ProjectStatusLogCreateWithoutProjectInput[]
      | ProjectStatusLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectStatusLogCreateOrConnectWithoutProjectInput
      | ProjectStatusLogCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectStatusLogUpsertWithWhereUniqueWithoutProjectInput
      | ProjectStatusLogUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectStatusLogCreateManyProjectInputEnvelope
    set?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    disconnect?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    delete?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    connect?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    update?:
      | ProjectStatusLogUpdateWithWhereUniqueWithoutProjectInput
      | ProjectStatusLogUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectStatusLogUpdateManyWithWhereWithoutProjectInput
      | ProjectStatusLogUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectStatusLogScalarWhereInput | ProjectStatusLogScalarWhereInput[]
  }

  export type ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectPhaseCreateWithoutProjectInput, ProjectPhaseUncheckedCreateWithoutProjectInput>
      | ProjectPhaseCreateWithoutProjectInput[]
      | ProjectPhaseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectPhaseCreateOrConnectWithoutProjectInput
      | ProjectPhaseCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectPhaseUpsertWithWhereUniqueWithoutProjectInput
      | ProjectPhaseUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectPhaseCreateManyProjectInputEnvelope
    set?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    disconnect?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    delete?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    connect?: ProjectPhaseWhereUniqueInput | ProjectPhaseWhereUniqueInput[]
    update?:
      | ProjectPhaseUpdateWithWhereUniqueWithoutProjectInput
      | ProjectPhaseUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectPhaseUpdateManyWithWhereWithoutProjectInput
      | ProjectPhaseUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectPhaseScalarWhereInput | ProjectPhaseScalarWhereInput[]
  }

  export type ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          ProjectMilestoneCreateWithoutProjectInput,
          ProjectMilestoneUncheckedCreateWithoutProjectInput
        >
      | ProjectMilestoneCreateWithoutProjectInput[]
      | ProjectMilestoneUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMilestoneCreateOrConnectWithoutProjectInput
      | ProjectMilestoneCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectMilestoneUpsertWithWhereUniqueWithoutProjectInput
      | ProjectMilestoneUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMilestoneCreateManyProjectInputEnvelope
    set?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    disconnect?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    delete?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    connect?: ProjectMilestoneWhereUniqueInput | ProjectMilestoneWhereUniqueInput[]
    update?:
      | ProjectMilestoneUpdateWithWhereUniqueWithoutProjectInput
      | ProjectMilestoneUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectMilestoneUpdateManyWithWhereWithoutProjectInput
      | ProjectMilestoneUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMilestoneScalarWhereInput | ProjectMilestoneScalarWhereInput[]
  }

  export type ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
      | ProjectTaskCreateWithoutProjectInput[]
      | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectTaskCreateOrConnectWithoutProjectInput
      | ProjectTaskCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectTaskUpsertWithWhereUniqueWithoutProjectInput
      | ProjectTaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?:
      | ProjectTaskUpdateWithWhereUniqueWithoutProjectInput
      | ProjectTaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectTaskUpdateManyWithWhereWithoutProjectInput
      | ProjectTaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectRiskCreateWithoutProjectInput, ProjectRiskUncheckedCreateWithoutProjectInput>
      | ProjectRiskCreateWithoutProjectInput[]
      | ProjectRiskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectRiskCreateOrConnectWithoutProjectInput
      | ProjectRiskCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectRiskUpsertWithWhereUniqueWithoutProjectInput
      | ProjectRiskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectRiskCreateManyProjectInputEnvelope
    set?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    disconnect?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    delete?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    connect?: ProjectRiskWhereUniqueInput | ProjectRiskWhereUniqueInput[]
    update?:
      | ProjectRiskUpdateWithWhereUniqueWithoutProjectInput
      | ProjectRiskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectRiskUpdateManyWithWhereWithoutProjectInput
      | ProjectRiskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectRiskScalarWhereInput | ProjectRiskScalarWhereInput[]
  }

  export type ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
      | ProjectMemberCreateWithoutProjectInput[]
      | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectMemberCreateOrConnectWithoutProjectInput
      | ProjectMemberCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput
      | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?:
      | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput
      | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectMemberUpdateManyWithWhereWithoutProjectInput
      | ProjectMemberUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput = {
    create?:
      | XOR<
          ProjectStatusLogCreateWithoutProjectInput,
          ProjectStatusLogUncheckedCreateWithoutProjectInput
        >
      | ProjectStatusLogCreateWithoutProjectInput[]
      | ProjectStatusLogUncheckedCreateWithoutProjectInput[]
    connectOrCreate?:
      | ProjectStatusLogCreateOrConnectWithoutProjectInput
      | ProjectStatusLogCreateOrConnectWithoutProjectInput[]
    upsert?:
      | ProjectStatusLogUpsertWithWhereUniqueWithoutProjectInput
      | ProjectStatusLogUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectStatusLogCreateManyProjectInputEnvelope
    set?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    disconnect?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    delete?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    connect?: ProjectStatusLogWhereUniqueInput | ProjectStatusLogWhereUniqueInput[]
    update?:
      | ProjectStatusLogUpdateWithWhereUniqueWithoutProjectInput
      | ProjectStatusLogUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?:
      | ProjectStatusLogUpdateManyWithWhereWithoutProjectInput
      | ProjectStatusLogUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectStatusLogScalarWhereInput | ProjectStatusLogScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutPhasesInput = {
    create?: XOR<ProjectCreateWithoutPhasesInput, ProjectUncheckedCreateWithoutPhasesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutPhasesInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutPhasesNestedInput = {
    create?: XOR<ProjectCreateWithoutPhasesInput, ProjectUncheckedCreateWithoutPhasesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutPhasesInput
    upsert?: ProjectUpsertWithoutPhasesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<
      XOR<ProjectUpdateToOneWithWhereWithoutPhasesInput, ProjectUpdateWithoutPhasesInput>,
      ProjectUncheckedUpdateWithoutPhasesInput
    >
  }

  export type ProjectCreateNestedOneWithoutMilestonesInput = {
    create?: XOR<ProjectCreateWithoutMilestonesInput, ProjectUncheckedCreateWithoutMilestonesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMilestonesInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutMilestonesNestedInput = {
    create?: XOR<ProjectCreateWithoutMilestonesInput, ProjectUncheckedCreateWithoutMilestonesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMilestonesInput
    upsert?: ProjectUpsertWithoutMilestonesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<
      XOR<ProjectUpdateToOneWithWhereWithoutMilestonesInput, ProjectUpdateWithoutMilestonesInput>,
      ProjectUncheckedUpdateWithoutMilestonesInput
    >
  }

  export type ProjectCreateNestedOneWithoutTaskTreeInput = {
    create?: XOR<ProjectCreateWithoutTaskTreeInput, ProjectUncheckedCreateWithoutTaskTreeInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTaskTreeInput
    connect?: ProjectWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutTaskTreeNestedInput = {
    create?: XOR<ProjectCreateWithoutTaskTreeInput, ProjectUncheckedCreateWithoutTaskTreeInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTaskTreeInput
    upsert?: ProjectUpsertWithoutTaskTreeInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<
      XOR<ProjectUpdateToOneWithWhereWithoutTaskTreeInput, ProjectUpdateWithoutTaskTreeInput>,
      ProjectUncheckedUpdateWithoutTaskTreeInput
    >
  }

  export type ProjectCreateNestedOneWithoutRisksInput = {
    create?: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRisksInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutRisksNestedInput = {
    create?: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRisksInput
    upsert?: ProjectUpsertWithoutRisksInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<
      XOR<ProjectUpdateToOneWithWhereWithoutRisksInput, ProjectUpdateWithoutRisksInput>,
      ProjectUncheckedUpdateWithoutRisksInput
    >
  }

  export type ProjectCreateNestedOneWithoutMembersInput = {
    create?: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMembersInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMembersInput
    upsert?: ProjectUpsertWithoutMembersInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<
      XOR<ProjectUpdateToOneWithWhereWithoutMembersInput, ProjectUpdateWithoutMembersInput>,
      ProjectUncheckedUpdateWithoutMembersInput
    >
  }

  export type ProjectCreateNestedOneWithoutStatusLogsInput = {
    create?: XOR<ProjectCreateWithoutStatusLogsInput, ProjectUncheckedCreateWithoutStatusLogsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutStatusLogsInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutStatusLogsNestedInput = {
    create?: XOR<ProjectCreateWithoutStatusLogsInput, ProjectUncheckedCreateWithoutStatusLogsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutStatusLogsInput
    upsert?: ProjectUpsertWithoutStatusLogsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<
      XOR<ProjectUpdateToOneWithWhereWithoutStatusLogsInput, ProjectUpdateWithoutStatusLogsInput>,
      ProjectUncheckedUpdateWithoutStatusLogsInput
    >
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ProjectPhaseCreateWithoutProjectInput = {
    name: string
    startDate: string
    endDate: string
    progress?: number
    status: string
  }

  export type ProjectPhaseUncheckedCreateWithoutProjectInput = {
    id?: number
    name: string
    startDate: string
    endDate: string
    progress?: number
    status: string
  }

  export type ProjectPhaseCreateOrConnectWithoutProjectInput = {
    where: ProjectPhaseWhereUniqueInput
    create: XOR<
      ProjectPhaseCreateWithoutProjectInput,
      ProjectPhaseUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectPhaseCreateManyProjectInputEnvelope = {
    data: ProjectPhaseCreateManyProjectInput | ProjectPhaseCreateManyProjectInput[]
  }

  export type ProjectMilestoneCreateWithoutProjectInput = {
    name: string
    dueDate: string
    status: string
    assignee?: string | null
    completedDate?: string | null
  }

  export type ProjectMilestoneUncheckedCreateWithoutProjectInput = {
    id?: number
    name: string
    dueDate: string
    status: string
    assignee?: string | null
    completedDate?: string | null
  }

  export type ProjectMilestoneCreateOrConnectWithoutProjectInput = {
    where: ProjectMilestoneWhereUniqueInput
    create: XOR<
      ProjectMilestoneCreateWithoutProjectInput,
      ProjectMilestoneUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectMilestoneCreateManyProjectInputEnvelope = {
    data: ProjectMilestoneCreateManyProjectInput | ProjectMilestoneCreateManyProjectInput[]
  }

  export type ProjectTaskCreateWithoutProjectInput = {
    code: string
    name: string
    status: string
    assignee?: string | null
    startDate?: string | null
    endDate?: string | null
    progress?: number
    parentId?: number | null
  }

  export type ProjectTaskUncheckedCreateWithoutProjectInput = {
    id?: number
    code: string
    name: string
    status: string
    assignee?: string | null
    startDate?: string | null
    endDate?: string | null
    progress?: number
    parentId?: number | null
  }

  export type ProjectTaskCreateOrConnectWithoutProjectInput = {
    where: ProjectTaskWhereUniqueInput
    create: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
  }

  export type ProjectTaskCreateManyProjectInputEnvelope = {
    data: ProjectTaskCreateManyProjectInput | ProjectTaskCreateManyProjectInput[]
  }

  export type ProjectRiskCreateWithoutProjectInput = {
    title: string
    level: string
    probability?: string | null
    impact?: string | null
    mitigation?: string | null
    status: string
  }

  export type ProjectRiskUncheckedCreateWithoutProjectInput = {
    id?: number
    title: string
    level: string
    probability?: string | null
    impact?: string | null
    mitigation?: string | null
    status: string
  }

  export type ProjectRiskCreateOrConnectWithoutProjectInput = {
    where: ProjectRiskWhereUniqueInput
    create: XOR<ProjectRiskCreateWithoutProjectInput, ProjectRiskUncheckedCreateWithoutProjectInput>
  }

  export type ProjectRiskCreateManyProjectInputEnvelope = {
    data: ProjectRiskCreateManyProjectInput | ProjectRiskCreateManyProjectInput[]
  }

  export type ProjectMemberCreateWithoutProjectInput = {
    userId: string
    name: string
    role: string
    avatar?: string | null
  }

  export type ProjectMemberUncheckedCreateWithoutProjectInput = {
    id?: number
    userId: string
    name: string
    role: string
    avatar?: string | null
  }

  export type ProjectMemberCreateOrConnectWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    create: XOR<
      ProjectMemberCreateWithoutProjectInput,
      ProjectMemberUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectMemberCreateManyProjectInputEnvelope = {
    data: ProjectMemberCreateManyProjectInput | ProjectMemberCreateManyProjectInput[]
  }

  export type ProjectStatusLogCreateWithoutProjectInput = {
    type: string
    at: Date | string
    operator: string
    message: string
    fromStatus?: string | null
    toStatus?: string | null
    reason?: string | null
  }

  export type ProjectStatusLogUncheckedCreateWithoutProjectInput = {
    id?: number
    type: string
    at: Date | string
    operator: string
    message: string
    fromStatus?: string | null
    toStatus?: string | null
    reason?: string | null
  }

  export type ProjectStatusLogCreateOrConnectWithoutProjectInput = {
    where: ProjectStatusLogWhereUniqueInput
    create: XOR<
      ProjectStatusLogCreateWithoutProjectInput,
      ProjectStatusLogUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectStatusLogCreateManyProjectInputEnvelope = {
    data: ProjectStatusLogCreateManyProjectInput | ProjectStatusLogCreateManyProjectInput[]
  }

  export type ProjectPhaseUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectPhaseWhereUniqueInput
    update: XOR<
      ProjectPhaseUpdateWithoutProjectInput,
      ProjectPhaseUncheckedUpdateWithoutProjectInput
    >
    create: XOR<
      ProjectPhaseCreateWithoutProjectInput,
      ProjectPhaseUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectPhaseUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectPhaseWhereUniqueInput
    data: XOR<ProjectPhaseUpdateWithoutProjectInput, ProjectPhaseUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectPhaseUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectPhaseScalarWhereInput
    data: XOR<
      ProjectPhaseUpdateManyMutationInput,
      ProjectPhaseUncheckedUpdateManyWithoutProjectInput
    >
  }

  export type ProjectPhaseScalarWhereInput = {
    AND?: ProjectPhaseScalarWhereInput | ProjectPhaseScalarWhereInput[]
    OR?: ProjectPhaseScalarWhereInput[]
    NOT?: ProjectPhaseScalarWhereInput | ProjectPhaseScalarWhereInput[]
    id?: IntFilter<'ProjectPhase'> | number
    projectId?: IntFilter<'ProjectPhase'> | number
    name?: StringFilter<'ProjectPhase'> | string
    startDate?: StringFilter<'ProjectPhase'> | string
    endDate?: StringFilter<'ProjectPhase'> | string
    progress?: IntFilter<'ProjectPhase'> | number
    status?: StringFilter<'ProjectPhase'> | string
  }

  export type ProjectMilestoneUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectMilestoneWhereUniqueInput
    update: XOR<
      ProjectMilestoneUpdateWithoutProjectInput,
      ProjectMilestoneUncheckedUpdateWithoutProjectInput
    >
    create: XOR<
      ProjectMilestoneCreateWithoutProjectInput,
      ProjectMilestoneUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectMilestoneUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectMilestoneWhereUniqueInput
    data: XOR<
      ProjectMilestoneUpdateWithoutProjectInput,
      ProjectMilestoneUncheckedUpdateWithoutProjectInput
    >
  }

  export type ProjectMilestoneUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectMilestoneScalarWhereInput
    data: XOR<
      ProjectMilestoneUpdateManyMutationInput,
      ProjectMilestoneUncheckedUpdateManyWithoutProjectInput
    >
  }

  export type ProjectMilestoneScalarWhereInput = {
    AND?: ProjectMilestoneScalarWhereInput | ProjectMilestoneScalarWhereInput[]
    OR?: ProjectMilestoneScalarWhereInput[]
    NOT?: ProjectMilestoneScalarWhereInput | ProjectMilestoneScalarWhereInput[]
    id?: IntFilter<'ProjectMilestone'> | number
    projectId?: IntFilter<'ProjectMilestone'> | number
    name?: StringFilter<'ProjectMilestone'> | string
    dueDate?: StringFilter<'ProjectMilestone'> | string
    status?: StringFilter<'ProjectMilestone'> | string
    assignee?: StringNullableFilter<'ProjectMilestone'> | string | null
    completedDate?: StringNullableFilter<'ProjectMilestone'> | string | null
  }

  export type ProjectTaskUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectTaskWhereUniqueInput
    update: XOR<ProjectTaskUpdateWithoutProjectInput, ProjectTaskUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
  }

  export type ProjectTaskUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectTaskWhereUniqueInput
    data: XOR<ProjectTaskUpdateWithoutProjectInput, ProjectTaskUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectTaskUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectTaskScalarWhereInput
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectTaskScalarWhereInput = {
    AND?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
    OR?: ProjectTaskScalarWhereInput[]
    NOT?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
    id?: IntFilter<'ProjectTask'> | number
    projectId?: IntFilter<'ProjectTask'> | number
    code?: StringFilter<'ProjectTask'> | string
    name?: StringFilter<'ProjectTask'> | string
    status?: StringFilter<'ProjectTask'> | string
    assignee?: StringNullableFilter<'ProjectTask'> | string | null
    startDate?: StringNullableFilter<'ProjectTask'> | string | null
    endDate?: StringNullableFilter<'ProjectTask'> | string | null
    progress?: IntFilter<'ProjectTask'> | number
    parentId?: IntNullableFilter<'ProjectTask'> | number | null
  }

  export type ProjectRiskUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectRiskWhereUniqueInput
    update: XOR<ProjectRiskUpdateWithoutProjectInput, ProjectRiskUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectRiskCreateWithoutProjectInput, ProjectRiskUncheckedCreateWithoutProjectInput>
  }

  export type ProjectRiskUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectRiskWhereUniqueInput
    data: XOR<ProjectRiskUpdateWithoutProjectInput, ProjectRiskUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectRiskUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectRiskScalarWhereInput
    data: XOR<ProjectRiskUpdateManyMutationInput, ProjectRiskUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectRiskScalarWhereInput = {
    AND?: ProjectRiskScalarWhereInput | ProjectRiskScalarWhereInput[]
    OR?: ProjectRiskScalarWhereInput[]
    NOT?: ProjectRiskScalarWhereInput | ProjectRiskScalarWhereInput[]
    id?: IntFilter<'ProjectRisk'> | number
    projectId?: IntFilter<'ProjectRisk'> | number
    title?: StringFilter<'ProjectRisk'> | string
    level?: StringFilter<'ProjectRisk'> | string
    probability?: StringNullableFilter<'ProjectRisk'> | string | null
    impact?: StringNullableFilter<'ProjectRisk'> | string | null
    mitigation?: StringNullableFilter<'ProjectRisk'> | string | null
    status?: StringFilter<'ProjectRisk'> | string
  }

  export type ProjectMemberUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    update: XOR<
      ProjectMemberUpdateWithoutProjectInput,
      ProjectMemberUncheckedUpdateWithoutProjectInput
    >
    create: XOR<
      ProjectMemberCreateWithoutProjectInput,
      ProjectMemberUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectMemberUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    data: XOR<
      ProjectMemberUpdateWithoutProjectInput,
      ProjectMemberUncheckedUpdateWithoutProjectInput
    >
  }

  export type ProjectMemberUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectMemberScalarWhereInput
    data: XOR<
      ProjectMemberUpdateManyMutationInput,
      ProjectMemberUncheckedUpdateManyWithoutProjectInput
    >
  }

  export type ProjectMemberScalarWhereInput = {
    AND?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
    OR?: ProjectMemberScalarWhereInput[]
    NOT?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
    id?: IntFilter<'ProjectMember'> | number
    projectId?: IntFilter<'ProjectMember'> | number
    userId?: StringFilter<'ProjectMember'> | string
    name?: StringFilter<'ProjectMember'> | string
    role?: StringFilter<'ProjectMember'> | string
    avatar?: StringNullableFilter<'ProjectMember'> | string | null
  }

  export type ProjectStatusLogUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectStatusLogWhereUniqueInput
    update: XOR<
      ProjectStatusLogUpdateWithoutProjectInput,
      ProjectStatusLogUncheckedUpdateWithoutProjectInput
    >
    create: XOR<
      ProjectStatusLogCreateWithoutProjectInput,
      ProjectStatusLogUncheckedCreateWithoutProjectInput
    >
  }

  export type ProjectStatusLogUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectStatusLogWhereUniqueInput
    data: XOR<
      ProjectStatusLogUpdateWithoutProjectInput,
      ProjectStatusLogUncheckedUpdateWithoutProjectInput
    >
  }

  export type ProjectStatusLogUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectStatusLogScalarWhereInput
    data: XOR<
      ProjectStatusLogUpdateManyMutationInput,
      ProjectStatusLogUncheckedUpdateManyWithoutProjectInput
    >
  }

  export type ProjectStatusLogScalarWhereInput = {
    AND?: ProjectStatusLogScalarWhereInput | ProjectStatusLogScalarWhereInput[]
    OR?: ProjectStatusLogScalarWhereInput[]
    NOT?: ProjectStatusLogScalarWhereInput | ProjectStatusLogScalarWhereInput[]
    id?: IntFilter<'ProjectStatusLog'> | number
    projectId?: IntFilter<'ProjectStatusLog'> | number
    type?: StringFilter<'ProjectStatusLog'> | string
    at?: DateTimeFilter<'ProjectStatusLog'> | Date | string
    operator?: StringFilter<'ProjectStatusLog'> | string
    message?: StringFilter<'ProjectStatusLog'> | string
    fromStatus?: StringNullableFilter<'ProjectStatusLog'> | string | null
    toStatus?: StringNullableFilter<'ProjectStatusLog'> | string | null
    reason?: StringNullableFilter<'ProjectStatusLog'> | string | null
  }

  export type ProjectCreateWithoutPhasesInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    milestones?: ProjectMilestoneCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutPhasesInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    milestones?: ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutPhasesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutPhasesInput, ProjectUncheckedCreateWithoutPhasesInput>
  }

  export type ProjectUpsertWithoutPhasesInput = {
    update: XOR<ProjectUpdateWithoutPhasesInput, ProjectUncheckedUpdateWithoutPhasesInput>
    create: XOR<ProjectCreateWithoutPhasesInput, ProjectUncheckedCreateWithoutPhasesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutPhasesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutPhasesInput, ProjectUncheckedUpdateWithoutPhasesInput>
  }

  export type ProjectUpdateWithoutPhasesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    milestones?: ProjectMilestoneUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutPhasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    milestones?: ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutMilestonesInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMilestonesInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMilestonesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMilestonesInput, ProjectUncheckedCreateWithoutMilestonesInput>
  }

  export type ProjectUpsertWithoutMilestonesInput = {
    update: XOR<ProjectUpdateWithoutMilestonesInput, ProjectUncheckedUpdateWithoutMilestonesInput>
    create: XOR<ProjectCreateWithoutMilestonesInput, ProjectUncheckedCreateWithoutMilestonesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMilestonesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMilestonesInput, ProjectUncheckedUpdateWithoutMilestonesInput>
  }

  export type ProjectUpdateWithoutMilestonesInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMilestonesInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutTaskTreeInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTaskTreeInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTaskTreeInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTaskTreeInput, ProjectUncheckedCreateWithoutTaskTreeInput>
  }

  export type ProjectUpsertWithoutTaskTreeInput = {
    update: XOR<ProjectUpdateWithoutTaskTreeInput, ProjectUncheckedUpdateWithoutTaskTreeInput>
    create: XOR<ProjectCreateWithoutTaskTreeInput, ProjectUncheckedCreateWithoutTaskTreeInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTaskTreeInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTaskTreeInput, ProjectUncheckedUpdateWithoutTaskTreeInput>
  }

  export type ProjectUpdateWithoutTaskTreeInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTaskTreeInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutRisksInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutRisksInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutRisksInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
  }

  export type ProjectUpsertWithoutRisksInput = {
    update: XOR<ProjectUpdateWithoutRisksInput, ProjectUncheckedUpdateWithoutRisksInput>
    create: XOR<ProjectCreateWithoutRisksInput, ProjectUncheckedCreateWithoutRisksInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutRisksInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutRisksInput, ProjectUncheckedUpdateWithoutRisksInput>
  }

  export type ProjectUpdateWithoutRisksInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutRisksInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutMembersInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMembersInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskUncheckedCreateNestedManyWithoutProjectInput
    statusLogs?: ProjectStatusLogUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMembersInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
  }

  export type ProjectUpsertWithoutMembersInput = {
    update: XOR<ProjectUpdateWithoutMembersInput, ProjectUncheckedUpdateWithoutMembersInput>
    create: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMembersInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMembersInput, ProjectUncheckedUpdateWithoutMembersInput>
  }

  export type ProjectUpdateWithoutMembersInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput
    statusLogs?: ProjectStatusLogUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutStatusLogsInput = {
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutStatusLogsInput = {
    id?: number
    code: string
    name: string
    status: string
    stage: string
    progress?: number
    budget?: string | null
    teamSize?: string | null
    dateRange?: string | null
    description?: string | null
    owner?: string | null
    riskLevel?: string | null
    milestone?: string | null
    tasks?: string | null
    templateId?: string | null
    dispatchStatus?: string | null
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    pendingDispatchCount?: number
    pendingExecutionCount?: number
    pendingAcceptanceCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    phases?: ProjectPhaseUncheckedCreateNestedManyWithoutProjectInput
    milestones?: ProjectMilestoneUncheckedCreateNestedManyWithoutProjectInput
    taskTree?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    risks?: ProjectRiskUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutStatusLogsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutStatusLogsInput, ProjectUncheckedCreateWithoutStatusLogsInput>
  }

  export type ProjectUpsertWithoutStatusLogsInput = {
    update: XOR<ProjectUpdateWithoutStatusLogsInput, ProjectUncheckedUpdateWithoutStatusLogsInput>
    create: XOR<ProjectCreateWithoutStatusLogsInput, ProjectUncheckedCreateWithoutStatusLogsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutStatusLogsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutStatusLogsInput, ProjectUncheckedUpdateWithoutStatusLogsInput>
  }

  export type ProjectUpdateWithoutStatusLogsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutStatusLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    budget?: NullableStringFieldUpdateOperationsInput | string | null
    teamSize?: NullableStringFieldUpdateOperationsInput | string | null
    dateRange?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
    riskLevel?: NullableStringFieldUpdateOperationsInput | string | null
    milestone?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    dispatchStatus?: NullableStringFieldUpdateOperationsInput | string | null
    executionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    acceptanceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    settlementStatus?: NullableStringFieldUpdateOperationsInput | string | null
    pendingDispatchCount?: IntFieldUpdateOperationsInput | number
    pendingExecutionCount?: IntFieldUpdateOperationsInput | number
    pendingAcceptanceCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phases?: ProjectPhaseUncheckedUpdateManyWithoutProjectNestedInput
    milestones?: ProjectMilestoneUncheckedUpdateManyWithoutProjectNestedInput
    taskTree?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    risks?: ProjectRiskUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectPhaseCreateManyProjectInput = {
    id?: number
    name: string
    startDate: string
    endDate: string
    progress?: number
    status: string
  }

  export type ProjectMilestoneCreateManyProjectInput = {
    id?: number
    name: string
    dueDate: string
    status: string
    assignee?: string | null
    completedDate?: string | null
  }

  export type ProjectTaskCreateManyProjectInput = {
    id?: number
    code: string
    name: string
    status: string
    assignee?: string | null
    startDate?: string | null
    endDate?: string | null
    progress?: number
    parentId?: number | null
  }

  export type ProjectRiskCreateManyProjectInput = {
    id?: number
    title: string
    level: string
    probability?: string | null
    impact?: string | null
    mitigation?: string | null
    status: string
  }

  export type ProjectMemberCreateManyProjectInput = {
    id?: number
    userId: string
    name: string
    role: string
    avatar?: string | null
  }

  export type ProjectStatusLogCreateManyProjectInput = {
    id?: number
    type: string
    at: Date | string
    operator: string
    message: string
    fromStatus?: string | null
    toStatus?: string | null
    reason?: string | null
  }

  export type ProjectPhaseUpdateWithoutProjectInput = {
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectPhaseUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectPhaseUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    startDate?: StringFieldUpdateOperationsInput | string
    endDate?: StringFieldUpdateOperationsInput | string
    progress?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectMilestoneUpdateWithoutProjectInput = {
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMilestoneUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMilestoneUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    dueDate?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    completedDate?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectTaskUpdateWithoutProjectInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProjectTaskUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProjectTaskUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignee?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: NullableStringFieldUpdateOperationsInput | string | null
    endDate?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: IntFieldUpdateOperationsInput | number
    parentId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ProjectRiskUpdateWithoutProjectInput = {
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectRiskUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectRiskUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    probability?: NullableStringFieldUpdateOperationsInput | string | null
    impact?: NullableStringFieldUpdateOperationsInput | string | null
    mitigation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectMemberUpdateWithoutProjectInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMemberUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectMemberUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectStatusLogUpdateWithoutProjectInput = {
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectStatusLogUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectStatusLogUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    operator?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    fromStatus?: NullableStringFieldUpdateOperationsInput | string | null
    toStatus?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
