import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskCardComponent } from './task-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Task, TaskStatus } from '../../../models';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task Title',
    description: 'Test task description that might be longer than the display area to test truncation functionality',
    status: TaskStatus.OPEN
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent, ButtonComponent, CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should expose TaskStatus enum to template', () => {
      expect(component.TaskStatus).toBe(TaskStatus);
    });
  });

  describe('Task Display', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display task title', () => {
      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe('Test Task Title');
    });

    it('should display task description', () => {
      const descriptionElement = fixture.debugElement.query(By.css('p.line-clamp-3'));
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement.nativeElement.textContent.trim()).toBe(mockTask.description);
    });

    it('should apply truncate class to title', () => {
      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement.nativeElement.className).toContain('truncate');
    });

    it('should apply line-clamp-3 class to description', () => {
      const descriptionElement = fixture.debugElement.query(By.css('p'));
      expect(descriptionElement.nativeElement.className).toContain('line-clamp-3');
    });
  });

  describe('Status Badge', () => {
    it('should display status badge for OPEN status', () => {
      component.task = { ...mockTask, status: TaskStatus.OPEN };
      fixture.detectChanges();

      const statusBadge = fixture.debugElement.query(By.css('span'));
      expect(statusBadge).toBeTruthy();
      expect(statusBadge.nativeElement.textContent.trim()).toBe('Open');
    });

    it('should display status badge for IN_PROGRESS status', () => {
      component.task = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      fixture.detectChanges();

      const statusBadge = fixture.debugElement.query(By.css('span'));
      expect(statusBadge.nativeElement.textContent.trim()).toBe('In Progress');
    });

    it('should display status badge for DONE status', () => {
      component.task = { ...mockTask, status: TaskStatus.DONE };
      fixture.detectChanges();

      const statusBadge = fixture.debugElement.query(By.css('span'));
      expect(statusBadge.nativeElement.textContent.trim()).toBe('Done');
    });

    it('should apply correct classes for OPEN status', () => {
      component.task = { ...mockTask, status: TaskStatus.OPEN };
      const classes = component.statusBadgeClasses;
      expect(classes).toContain('bg-secondary-100');
      expect(classes).toContain('text-secondary-800');
    });

    it('should apply correct classes for IN_PROGRESS status', () => {
      component.task = { ...mockTask, status: TaskStatus.IN_PROGRESS };
      const classes = component.statusBadgeClasses;
      expect(classes).toContain('bg-warning-100');
      expect(classes).toContain('text-warning-800');
    });

    it('should apply correct classes for DONE status', () => {
      component.task = { ...mockTask, status: TaskStatus.DONE };
      const classes = component.statusBadgeClasses;
      expect(classes).toContain('bg-success-100');
      expect(classes).toContain('text-success-800');
    });

    it('should handle unknown status', () => {
      component.task = { ...mockTask, status: 'UNKNOWN' as TaskStatus };
      const classes = component.statusBadgeClasses;
      expect(classes).toContain('bg-secondary-100');
      expect(classes).toContain('text-secondary-800');
    });
  });

  describe('Action Buttons', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render edit button', () => {
      const editButton = fixture.debugElement.query(By.css('button[title="Edit task"]'));
      expect(editButton).toBeTruthy();
    });

    it('should render delete button', () => {
      const deleteButton = fixture.debugElement.query(By.css('button[title="Delete task"]'));
      expect(deleteButton).toBeTruthy();
    });

    it('should emit taskEdit event when edit button is clicked', () => {
      spyOn(component.taskEdit, 'emit');
      const editButton = fixture.debugElement.query(By.css('button[title="Edit task"]'));
      
      editButton.nativeElement.click();
      
      expect(component.taskEdit.emit).toHaveBeenCalledWith(mockTask);
    });

    it('should confirm before emitting taskDeleted event', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component.taskDeleted, 'emit');
      const deleteButton = fixture.debugElement.query(By.css('button[title="Delete task"]'));
      
      deleteButton.nativeElement.click();
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
      expect(component.taskDeleted.emit).toHaveBeenCalledWith(mockTask.id);
    });

    it('should not emit taskDeleted event when confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(component.taskDeleted, 'emit');
      const deleteButton = fixture.debugElement.query(By.css('button[title="Delete task"]'));
      
      deleteButton.nativeElement.click();
      
      expect(window.confirm).toHaveBeenCalled();
      expect(component.taskDeleted.emit).not.toHaveBeenCalled();
    });
  });

  describe('Status Action Buttons', () => {
    describe('OPEN Status Actions', () => {
      beforeEach(() => {
        component.task = { ...mockTask, status: TaskStatus.OPEN };
        fixture.detectChanges();
      });

      it('should show Start button for OPEN tasks', () => {
        const startButton = fixture.debugElement.query(By.css('app-button'));
        expect(startButton).toBeTruthy();
        expect(startButton.nativeElement.textContent.trim()).toContain('Start');
      });

      it('should emit statusChanged with IN_PROGRESS when Start is clicked', () => {
        spyOn(component.statusChanged, 'emit');
        const startButton = fixture.debugElement.query(By.css('app-button'));
        
        startButton.triggerEventHandler('clicked', null);
        
        expect(component.statusChanged.emit).toHaveBeenCalledWith({
          taskId: mockTask.id,
          status: TaskStatus.IN_PROGRESS
        });
      });
    });

    describe('IN_PROGRESS Status Actions', () => {
      beforeEach(() => {
        component.task = { ...mockTask, status: TaskStatus.IN_PROGRESS };
        fixture.detectChanges();
      });

      it('should show Reopen and Complete buttons for IN_PROGRESS tasks', () => {
        const buttons = fixture.debugElement.queryAll(By.css('app-button'));
        expect(buttons.length).toBe(2);
        
        const buttonTexts = buttons.map(btn => btn.nativeElement.textContent.trim());
        expect(buttonTexts).toContain('Reopen');
        expect(buttonTexts).toContain('Complete');
      });

      it('should emit statusChanged with OPEN when Reopen is clicked', () => {
        spyOn(component.statusChanged, 'emit');
        const buttons = fixture.debugElement.queryAll(By.css('app-button'));
        const reopenButton = buttons.find(btn => 
          btn.nativeElement.textContent.trim().includes('Reopen')
        );
        
        reopenButton?.triggerEventHandler('clicked', null);
        
        expect(component.statusChanged.emit).toHaveBeenCalledWith({
          taskId: mockTask.id,
          status: TaskStatus.OPEN
        });
      });

      it('should emit statusChanged with DONE when Complete is clicked', () => {
        spyOn(component.statusChanged, 'emit');
        const buttons = fixture.debugElement.queryAll(By.css('app-button'));
        const completeButton = buttons.find(btn => 
          btn.nativeElement.textContent.trim().includes('Complete')
        );
        
        completeButton?.triggerEventHandler('clicked', null);
        
        expect(component.statusChanged.emit).toHaveBeenCalledWith({
          taskId: mockTask.id,
          status: TaskStatus.DONE
        });
      });
    });

    describe('DONE Status Actions', () => {
      beforeEach(() => {
        component.task = { ...mockTask, status: TaskStatus.DONE };
        fixture.detectChanges();
      });

      it('should show Reopen button for DONE tasks', () => {
        const button = fixture.debugElement.query(By.css('app-button'));
        expect(button).toBeTruthy();
        expect(button.nativeElement.textContent.trim()).toContain('Reopen');
      });

      it('should emit statusChanged with IN_PROGRESS when Reopen is clicked', () => {
        spyOn(component.statusChanged, 'emit');
        const reopenButton = fixture.debugElement.query(By.css('app-button'));
        
        reopenButton.triggerEventHandler('clicked', null);
        
        expect(component.statusChanged.emit).toHaveBeenCalledWith({
          taskId: mockTask.id,
          status: TaskStatus.IN_PROGRESS
        });
      });
    });
  });

  describe('Component Methods', () => {
    describe('getStatusLabel', () => {
      it('should return correct label for OPEN status', () => {
        const label = component.getStatusLabel(TaskStatus.OPEN);
        expect(label).toBe('Open');
      });

      it('should return correct label for IN_PROGRESS status', () => {
        const label = component.getStatusLabel(TaskStatus.IN_PROGRESS);
        expect(label).toBe('In Progress');
      });

      it('should return correct label for DONE status', () => {
        const label = component.getStatusLabel(TaskStatus.DONE);
        expect(label).toBe('Done');
      });

      it('should return Unknown for unrecognized status', () => {
        const label = component.getStatusLabel('INVALID' as TaskStatus);
        expect(label).toBe('Unknown');
      });
    });

    describe('onStatusChange', () => {
      it('should emit statusChanged event with correct parameters', () => {
        spyOn(component.statusChanged, 'emit');
        
        component.onStatusChange(TaskStatus.DONE);
        
        expect(component.statusChanged.emit).toHaveBeenCalledWith({
          taskId: mockTask.id,
          status: TaskStatus.DONE
        });
      });
    });

    describe('onEdit', () => {
      it('should emit taskEdit event with task', () => {
        spyOn(component.taskEdit, 'emit');
        
        component.onEdit();
        
        expect(component.taskEdit.emit).toHaveBeenCalledWith(mockTask);
      });
    });

    describe('onDelete', () => {
      it('should emit taskDeleted when confirmed', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(component.taskDeleted, 'emit');
        
        component.onDelete();
        
        expect(component.taskDeleted.emit).toHaveBeenCalledWith(mockTask.id);
      });

      it('should not emit taskDeleted when cancelled', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        spyOn(component.taskDeleted, 'emit');
        
        component.onDelete();
        
        expect(component.taskDeleted.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Layout and Structure', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should use card component with hover effect', () => {
      const cardComponent = fixture.debugElement.query(By.directive(CardComponent));
      expect(cardComponent).toBeTruthy();
      expect(cardComponent.componentInstance.hover).toBe(true);
    });

    it('should have full height layout', () => {
      const cardElement = fixture.debugElement.query(By.css('app-card'));
      expect(cardElement.nativeElement.className).toContain('h-full');
    });

    it('should render action buttons in header', () => {
      const headerActions = fixture.debugElement.query(By.css('.flex.items-center.space-x-2'));
      expect(headerActions).toBeTruthy();
      
      const actionButtons = headerActions.queryAll(By.css('button'));
      expect(actionButtons.length).toBe(2); // Edit and Delete buttons
    });

    it('should render status actions at bottom', () => {
      const statusActions = fixture.debugElement.query(By.css('.mt-auto'));
      expect(statusActions).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle tasks with very long titles', () => {
      const longTitle = 'A'.repeat(100);
      component.task = { ...mockTask, title: longTitle };
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement.nativeElement.className).toContain('truncate');
    });

    it('should handle tasks with very long descriptions', () => {
      const longDescription = 'Very long description. '.repeat(50);
      component.task = { ...mockTask, description: longDescription };
      fixture.detectChanges();
      
      const descriptionElement = fixture.debugElement.query(By.css('p'));
      expect(descriptionElement.nativeElement.className).toContain('line-clamp-3');
    });

    it('should handle tasks with empty title', () => {
      component.task = { ...mockTask, title: '' };
      fixture.detectChanges();
      
      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle tasks with empty description', () => {
      component.task = { ...mockTask, description: '' };
      fixture.detectChanges();
      
      const descriptionElement = fixture.debugElement.query(By.css('p'));
      expect(descriptionElement.nativeElement.textContent.trim()).toBe('');
    });
  });
}); 