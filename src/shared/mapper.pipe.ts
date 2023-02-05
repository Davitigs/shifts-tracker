import { Pipe, PipeTransform } from '@angular/core';

export type MapperPipeFn<T, G> = (item: T, ...args: any[]) => G;

/**
 * @author
 *  https://twitter.com/marsibarsi/status/1270650741275987970
 * @desc
 *  This way Angular runs change detection only when mapper parameters have changed
 **/
@Pipe({
  name: 'mapper',
})
export class MapperPipe<T, G extends any> implements PipeTransform {
  transform(value: T, mapper: MapperPipeFn<T, G>, ...args: any[]): G {
    return mapper(value, ...args);
  }
}
