import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SubTimeCapsuleFormService } from './sub-time-capsule-form.service';
import { SubTimeCapsuleService } from '../service/sub-time-capsule.service';
import { ISubTimeCapsule } from '../sub-time-capsule.model';

import { SubTimeCapsuleUpdateComponent } from './sub-time-capsule-update.component';

describe('SubTimeCapsule Management Update Component', () => {
  let comp: SubTimeCapsuleUpdateComponent;
  let fixture: ComponentFixture<SubTimeCapsuleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subTimeCapsuleFormService: SubTimeCapsuleFormService;
  let subTimeCapsuleService: SubTimeCapsuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SubTimeCapsuleUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SubTimeCapsuleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubTimeCapsuleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subTimeCapsuleFormService = TestBed.inject(SubTimeCapsuleFormService);
    subTimeCapsuleService = TestBed.inject(SubTimeCapsuleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const subTimeCapsule: ISubTimeCapsule = { id: 456 };

      activatedRoute.data = of({ subTimeCapsule });
      comp.ngOnInit();

      expect(comp.subTimeCapsule).toEqual(subTimeCapsule);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubTimeCapsule>>();
      const subTimeCapsule = { id: 123 };
      jest.spyOn(subTimeCapsuleFormService, 'getSubTimeCapsule').mockReturnValue(subTimeCapsule);
      jest.spyOn(subTimeCapsuleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subTimeCapsule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subTimeCapsule }));
      saveSubject.complete();

      // THEN
      expect(subTimeCapsuleFormService.getSubTimeCapsule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(subTimeCapsuleService.update).toHaveBeenCalledWith(expect.objectContaining(subTimeCapsule));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubTimeCapsule>>();
      const subTimeCapsule = { id: 123 };
      jest.spyOn(subTimeCapsuleFormService, 'getSubTimeCapsule').mockReturnValue({ id: null });
      jest.spyOn(subTimeCapsuleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subTimeCapsule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subTimeCapsule }));
      saveSubject.complete();

      // THEN
      expect(subTimeCapsuleFormService.getSubTimeCapsule).toHaveBeenCalled();
      expect(subTimeCapsuleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISubTimeCapsule>>();
      const subTimeCapsule = { id: 123 };
      jest.spyOn(subTimeCapsuleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subTimeCapsule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subTimeCapsuleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
