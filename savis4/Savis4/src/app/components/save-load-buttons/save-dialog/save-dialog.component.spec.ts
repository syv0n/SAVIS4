import { SaveDialogComponent } from './save-dialog.component';
import { of } from 'rxjs';

describe('SaveDialogComponent', () => {
  let component: SaveDialogComponent;
  let mockAngularFireAuth: any;
  let mockAngularFirestore: any;
  let mockDialog: any;
  let mockData: any;

  beforeEach(() => {
    mockAngularFireAuth = {
      authState: of({ uid: '123' })
    };
    mockAngularFirestore = {
      collection: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      toPromise: jest.fn().mockResolvedValue({ empty: true })
    };
    mockDialog = jest.fn();
    mockData = { feature: 'testFeature' };

    component = new SaveDialogComponent(
      mockDialog,
      mockData,
      mockAngularFireAuth,
      mockAngularFirestore
    );
  });

  it('should set isFileNameUnique to true when checkFileName is called and the file name is unique', (done) => {
    component.checkFileName('uniqueFileName');

    setTimeout(() => {
      expect(component.isFileNameUnique).toBe(true);
      done();
    }, 0);
  });

  it('should set isFileNameUnique to false when checkFileName is called and the file name is not unique', (done) => {
    mockAngularFirestore.toPromise.mockResolvedValue({ empty: false });

    component.checkFileName('nonUniqueFileName');

    setTimeout(() => {
      expect(component.isFileNameUnique).toBe(false);
      done();
    }, 0);
  });

  it('should call checkFileName when onFileNameChange is called', () => {
    const checkFileNameSpy = jest.spyOn(component, 'checkFileName');

    component.onFileNameChange('testFileName');

    expect(checkFileNameSpy).toHaveBeenCalledWith('testFileName');
  });
});