import { ContainsFieldNamePipe } from './contains-fieldname.pipe';

describe('ContainsFieldnamePipe', () => {
  it('create an instance', () => {
    const pipe = new ContainsFieldNamePipe();
    expect(pipe).toBeTruthy();
  });
});
