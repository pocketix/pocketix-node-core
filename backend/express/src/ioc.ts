import {Container} from 'typedi';
import {IocContainer, IocContainerFactory} from '@tsoa/runtime';

/**
 * Simple wrapper that adapts the typedi to tsoa ioc
 * @param request input request
 */
const iocContainer: IocContainerFactory = (request: Request): IocContainer => {
    const container = Container;
    container.bind(request);
    return container;
};


// export according to convention
export { iocContainer };
