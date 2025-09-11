import { LoadDialogComponent } from './load-dialog.component';
import { of } from 'rxjs';

describe('LoadDialogComponent', () => {
  let component: LoadDialogComponent;
  let mockAngularFireAuth: any;
  let mockAngularFirestore: any;
  let mockDialog: any;
  let mockData: any;
  let mockSharedService: any;

  beforeEach(() => {
    mockAngularFireAuth = {
      authState: of({ uid: '123' })
    };
    mockAngularFirestore = {
      collection: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      toPromise: jest.fn().mockResolvedValue({ empty: true, docs: [{ ref: { delete: jest.fn(), update: jest.fn() } }] })
    };
    mockDialog = {
      open: jest.fn().mockReturnThis(),
      closeAll: jest.fn(),
      afterClosed: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockImplementation((callback) => callback(true))
    };
    mockData = { files: [], feature: 'testFeature' };
    mockSharedService = {
      changeData: jest.fn()
    };

    component = new LoadDialogComponent(
      mockDialog,
      mockData,
      mockSharedService,
      mockAngularFireAuth,
      mockAngularFirestore
    );
  });

  it('should close all dialogs when onNoClick is called', () => {
    component.onNoClick();

    expect(mockDialog.closeAll).toHaveBeenCalled();
  });

  it('should change data when loadFile is called', () => {
    component.selectedFile = { data: 'testData' };

    component.loadFile();

    expect(mockSharedService.changeData).toHaveBeenCalledWith('testData');
  });

  it('should update document when editFile is called and user is authenticated', (done) => {
    component.selectedFile = { fileName: 'testFileName', data: 'testData' };

    component.editFile();

    setTimeout(() => {
      expect(mockAngularFirestore.collection).toHaveBeenCalled();
      expect(mockDialog.closeAll).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should delete document when deleteFile is called and user is authenticated', (done) => {
    component.selectedFile = { fileName: 'testFileName' };

    component.deleteFile();

    setTimeout(() => {
      expect(mockAngularFirestore.collection).toHaveBeenCalled();
      expect(mockDialog.closeAll).toHaveBeenCalled();
      done();
    }, 0);
  });
});