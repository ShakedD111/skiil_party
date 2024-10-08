

interface baseHandler<T, Y> {
    create(entity: T): Promise<void>;
    update(id: Y, updates: Partial<T>) : Promise<void>;
    delete(id: Y) : Promise<void>;
    getById(id: Y) : Promise<void>;
}