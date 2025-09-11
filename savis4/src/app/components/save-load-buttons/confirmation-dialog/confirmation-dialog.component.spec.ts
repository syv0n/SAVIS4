import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let mockDialogRef: any;
  let mockDialog: any;

  beforeEach(() => {
    mockDialogRef = {
      close: jest.fn()
    };
    mockDialog = jest.fn();

    component = new ConfirmationDialogComponent(
      mockDialogRef,
      mockDialog
    );
  });

  it('should close dialog with false when onNoClick is called', () => {
    component.onNoClick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when onYesClick is called', () => {
    component.onYesClick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});