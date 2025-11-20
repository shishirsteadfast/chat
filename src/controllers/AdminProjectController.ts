// src/controllers/AdminProjectController.ts
import { Request, Response } from 'express';
import { Project } from '../models';
import { generateApiKey } from '../utils/tokens';

export class AdminProjectController {
  /**
   * GET /admin/projects
   * List all projects
   */
  static async list(req: Request, res: Response) {
    const projects = await Project.findAll({
      order: [['id', 'DESC']],
    });

    return res.render('projects/list', {
      title: 'Projects',
      projects,
      // layout: 'layouts/master' // not needed, default is set in app.ts
    });
  }

  /**
   * GET /admin/projects/create
   * Show create project form
   */
  static createPage(req: Request, res: Response) {
    return res.render('projects/form', {
      title: 'Create Project',
      project: null,
    });
  }

  /**
   * POST /admin/projects/create
   * Create new project + auto-generate api_key
   */
  static async create(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      // could add error UI; for now just redirect back
      return res.redirect('/admin/projects/create');
    }

    const api_key = generateApiKey();

    await Project.create({
      name,
      api_key,
    });

    return res.redirect('/admin/projects');
  }

  /**
   * GET /admin/projects/:id/edit
   * Show edit form for existing project
   */
  static async editPage(req: Request, res: Response) {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    return res.render('projects/form', {
      title: 'Edit Project',
      project,
    });
  }

  /**
   * POST /admin/projects/:id/edit
   * Update project name (API key stays same)
   */
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    if (!name) {
      // simple behavior: keep same page, ideally show error via flash
      return res.render('projects/form', {
        title: 'Edit Project',
        project,
      });
    }

    project.name = name;
    await project.save();

    return res.redirect('/admin/projects');
  }

  /**
   * POST /admin/projects/:id/delete
   * Delete a project (cascade deletes chat data via FK)
   */
  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    await Project.destroy({
      where: { id },
    });

    return res.redirect('/admin/projects');
  }
}
