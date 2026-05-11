#!/usr/bin/env ruby
# frozen_string_literal: true

# Parse every GitHub Actions workflow file as YAML. Exits 1 on parse errors.
# Requires unique workflow display names across files (avoids duplicate entries in the Actions UI).
# Validates on.schedule[].cron uses GitHub's 5-field cron (minute hour day month weekday), not 6-field.
# Also requires every non-reusable-workflow job to set timeout-minutes as an integer from 1 to 360
# (GitHub-hosted runner maximum). Reusable workflow callers (job `uses:` + no `steps:`) do not
# support timeout-minutes in GitHub Actions.
# Jobs with `steps` must set `runs-on` unless the job is a reusable-workflow caller (`uses:` + no steps).
# Job ids (jobs: map keys) must match GitHub naming rules (letter or _ first; then letters, digits, -, _).
# Job-level uses: ./... must be a reusable workflow under .github/workflows/*.yml|.yaml (no .. segments).
# Requires a non-empty workflow `name`, top-level `permissions:` (Hash mapping, `{}`, or
# GHA shorthand strings read-all / write-all only),
# `on:` as a non-empty mapping (Psych maps bare `on` to key true),
# and a non-empty `jobs:` map with at least one job.
# Requires each workflow file to end with a newline (POSIX text file, stable diffs).
# Rejects UTF-8 BOM at file start (breaks some tooling and is easy to add by mistake).
# When concurrency: is present, it must be a mapping with a non-empty group string;
# cancel-in-progress, if set, must be boolean.
# When on.workflow_run is present, it must declare workflows: (non-empty string array) and types: (non-empty string array).
# When on.push / on.pull_request use branch/path/tag filters, each set key must be a non-empty string or non-empty string array.
# on.pull_request.types must be a non-empty string array (when present). on.push must not declare types: (unsupported).
# When on.merge_group is present, it must be a mapping with types: as a non-empty string array (merge queue / checks_requested).
# When on.schedule is present, it must be a non-empty array; each entry must be a mapping with a non-empty cron string (then 5-field check).
# When on.workflow_dispatch declares inputs:, each spec must be a mapping; if type: choice, options: must be a non-empty string array.
# If type: is set, it must be boolean, choice, environment, number, or string. Inputs may omit type (GitHub defaults).
# When on.workflow_call declares inputs:, each input must declare type: (reusable workflow contract); choice requires options:.
# When on.workflow_call declares secrets:, each entry must be a mapping; required: must be boolean if set.
# Top-level run-name: when set must be a non-empty string. Top-level env: when set must be a mapping (not null).
# Top-level defaults: when set must be a mapping; defaults.run must be a mapping; defaults.run.shell and
# defaults.run.working-directory must be non-empty strings when set.
# Used by workflow-yaml-sanity and workflow contract guards (Ruby stdlib only).

require 'yaml'

ROOT = File.expand_path('../..', __dir__)
Dir.chdir(ROOT) do
  files = Dir.glob('.github/workflows/**/*.{yml,yaml}')
  abort 'No workflow files found.' if files.empty?

  failed = []
  name_violations = []
  permissions_violations = []
  permissions_shape_violations = []
  trigger_violations = []
  jobs_violations = []
  timeout_violations = []
  runs_on_violations = []
  cron_violations = []
  schedule_shape_violations = []
  newline_violations = []
  bom_violations = []
  job_id_violations = []
  local_uses_violations = []
  concurrency_violations = []
  workflow_run_violations = []
  workflow_dispatch_violations = []
  workflow_call_violations = []
  trigger_filter_violations = []
  merge_group_violations = []
  run_name_violations = []
  top_level_env_violations = []
  defaults_violations = []
  name_to_files = Hash.new { |h, k| h[k] = [] }

  job_id_ok = /\A[a-zA-Z_][a-zA-Z0-9_-]*\z/
  local_reusable_uses_ok = %r{\A\./\.github/workflows/.+\.(yml|yaml)\z}

  files.each do |f|
    begin
      raw = File.binread(f)
      bom_violations << f if raw.bytesize >= 3 && raw.getbyte(0) == 0xEF && raw.getbyte(1) == 0xBB && raw.getbyte(2) == 0xBF
      newline_violations << f if !raw.empty? && raw[-1] != "\n"

      data = YAML.load_file(f)
      puts "ok: #{f}"
      unless data.is_a?(Hash)
        failed << f
        next
      end

      unless data['name'].is_a?(String) && !data['name'].strip.empty?
        name_violations << f
      else
        name_to_files[data['name'].strip] << f
      end

      unless data.key?('permissions')
        permissions_violations << f
      else
        perm = data['permissions']
        unless perm.is_a?(Hash) || %w[read-all write-all].include?(perm)
          permissions_shape_violations << f
        end
      end

      if data.key?('run-name')
        rn = data['run-name']
        unless rn.is_a?(String) && !rn.strip.empty?
          run_name_violations << "#{f}: run-name must be a non-empty string when set, got #{rn.class}"
        end
      end

      if data.key?('env')
        ev = data['env']
        if ev.nil?
          top_level_env_violations << "#{f}: top-level env: must not be null (omit the key or provide a mapping)"
        elsif !ev.is_a?(Hash)
          top_level_env_violations << "#{f}: top-level env: must be a mapping, got #{ev.class}"
        end
      end

      if data.key?('defaults')
        defs = data['defaults']
        unless defs.is_a?(Hash)
          defaults_violations << "#{f}: top-level defaults: must be a mapping, got #{defs.class}"
        else
          if defs.key?('run')
            drun = defs['run']
            unless drun.is_a?(Hash)
              defaults_violations << "#{f}: defaults.run must be a mapping, got #{drun.class}"
            else
              if drun.key?('shell') && !(drun['shell'].is_a?(String) && !drun['shell'].to_s.strip.empty?)
                defaults_violations << "#{f}: defaults.run.shell must be a non-empty string when set"
              end
              if drun.key?('working-directory') && !(drun['working-directory'].is_a?(String) && !drun['working-directory'].to_s.strip.empty?)
                defaults_violations << "#{f}: defaults.run.working-directory must be a non-empty string when set"
              end
            end
          end
        end
      end

      triggers = data['on'] || data[true]
      unless triggers.is_a?(Hash) && !triggers.empty?
        trigger_violations << f
      end

      if triggers.is_a?(Hash) && triggers.key?('workflow_run')
        wr = triggers['workflow_run']
        unless wr.is_a?(Hash)
          workflow_run_violations << "#{f}: on.workflow_run must be a mapping"
        else
          wfs = wr['workflows']
          if wfs.is_a?(Array) && !wfs.empty?
            if wfs.any? { |w| !w.is_a?(String) || w.strip.empty? }
              workflow_run_violations << "#{f}: on.workflow_run.workflows entries must be non-empty strings"
            end
          else
            workflow_run_violations << "#{f}: on.workflow_run.workflows must be a non-empty array of workflow display names"
          end

          if wr.key?('types')
            types = wr['types']
            if types.is_a?(Array) && !types.empty?
              if types.any? { |t| !t.is_a?(String) || t.strip.empty? }
                workflow_run_violations << "#{f}: on.workflow_run.types entries must be non-empty strings"
              end
            else
              workflow_run_violations << "#{f}: on.workflow_run.types must be a non-empty array"
            end
          else
            workflow_run_violations << "#{f}: on.workflow_run must declare types: (e.g. [completed])"
          end
        end
      end

      if triggers.is_a?(Hash) && triggers.key?('workflow_dispatch')
        wd = triggers['workflow_dispatch']
        if !wd.nil? && wd != {}
          if !wd.is_a?(Hash)
            workflow_dispatch_violations << "#{f}: on.workflow_dispatch must be a mapping, null, or {}"
          elsif wd.key?('inputs')
            inputs = wd['inputs']
            if inputs.nil?
              workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs must not be null (omit inputs or provide a mapping)"
            elsif !inputs.is_a?(Hash)
              workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs must be a mapping of input names to specs"
            elsif !inputs.empty?
              allowed_wd_types = %w[boolean choice environment number string]
              inputs.each do |inp_key, spec|
                iname = inp_key.to_s
                unless spec.is_a?(Hash)
                  workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs.#{iname} must be a mapping"
                  next
                end
                if spec.key?('options')
                  t = spec['type']
                  ts = t.is_a?(String) ? t.strip : t.nil? ? '' : t.to_s.strip
                  unless ts == 'choice'
                    workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs.#{iname} declares options: and must set type: choice"
                    next
                  end
                end
                next unless spec.key?('type')

                t = spec['type']
                ts = t.is_a?(String) ? t.strip : t.nil? ? '' : t.to_s.strip
                if ts.empty?
                  workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs.#{iname} type: must be non-empty when set"
                  next
                end
                unless allowed_wd_types.include?(ts)
                  workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs.#{iname}.type #{ts.inspect} must be one of #{allowed_wd_types.join(', ')}"
                  next
                end
                next unless ts == 'choice'

                opts = spec['options']
                unless opts.is_a?(Array) && !opts.empty? && opts.all? { |o| o.to_s.strip != '' }
                  workflow_dispatch_violations << "#{f}: on.workflow_dispatch.inputs.#{iname} (type choice) must declare non-empty options: array of non-empty strings"
                end
              end
            end
          end
        end
      end

      if triggers.is_a?(Hash) && triggers.key?('workflow_call')
        wc = triggers['workflow_call']
        if !wc.nil? && wc != {}
          if !wc.is_a?(Hash)
            workflow_call_violations << "#{f}: on.workflow_call must be a mapping, null, or {}"
          else
            if wc.key?('inputs')
              inputs = wc['inputs']
              if inputs.nil?
                workflow_call_violations << "#{f}: on.workflow_call.inputs must not be null (omit inputs or provide a mapping)"
              elsif !inputs.is_a?(Hash)
                workflow_call_violations << "#{f}: on.workflow_call.inputs must be a mapping of input names to specs"
              elsif !inputs.empty?
                allowed_wc_types = %w[boolean choice environment number string]
                inputs.each do |inp_key, spec|
                  iname = inp_key.to_s
                  unless spec.is_a?(Hash)
                    workflow_call_violations << "#{f}: on.workflow_call.inputs.#{iname} must be a mapping"
                    next
                  end
                  if spec.key?('options')
                    t = spec['type']
                    ts = t.is_a?(String) ? t.strip : t.nil? ? '' : t.to_s.strip
                    unless ts == 'choice'
                      workflow_call_violations << "#{f}: on.workflow_call.inputs.#{iname} declares options: and must set type: choice"
                      next
                    end
                  end
                  unless spec.key?('type')
                    workflow_call_violations << "#{f}: on.workflow_call.inputs.#{iname} must declare type: (required for reusable workflows)"
                    next
                  end
                  t = spec['type']
                  ts = t.is_a?(String) ? t.strip : t.nil? ? '' : t.to_s.strip
                  if ts.empty?
                    workflow_call_violations << "#{f}: on.workflow_call.inputs.#{iname} type: must be non-empty"
                    next
                  end
                  unless allowed_wc_types.include?(ts)
                    workflow_call_violations << "#{f}: on.workflow_call.inputs.#{iname}.type #{ts.inspect} must be one of #{allowed_wc_types.join(', ')}"
                    next
                  end
                  next unless ts == 'choice'

                  opts = spec['options']
                  unless opts.is_a?(Array) && !opts.empty? && opts.all? { |o| o.to_s.strip != '' }
                    workflow_call_violations << "#{f}: on.workflow_call.inputs.#{iname} (type choice) must declare non-empty options: array of non-empty strings"
                  end
                end
              end
            end

            if wc.key?('secrets')
              secrets = wc['secrets']
              if secrets.nil?
                workflow_call_violations << "#{f}: on.workflow_call.secrets must not be null (omit secrets or provide a mapping)"
              elsif !secrets.is_a?(Hash)
                workflow_call_violations << "#{f}: on.workflow_call.secrets must be a mapping of secret names to specs"
              elsif !secrets.empty?
                secrets.each do |sec_key, spec|
                  sn = sec_key.to_s
                  unless spec.is_a?(Hash)
                    workflow_call_violations << "#{f}: on.workflow_call.secrets.#{sn} must be a mapping"
                    next
                  end
                  next unless spec.key?('required')

                  req = spec['required']
                  unless req == true || req == false
                    workflow_call_violations << "#{f}: on.workflow_call.secrets.#{sn}.required must be true or false, got #{req.inspect}"
                  end
                end
              end
            end
          end
        end
      end

      if triggers.is_a?(Hash)
        %w[push pull_request].each do |event|
          next unless triggers.key?(event)

          ev = triggers[event]
          next unless ev.is_a?(Hash)

          if event == 'push' && ev.key?('types')
            trigger_filter_violations << "#{f}: on.push must not declare types: (unsupported by GitHub Actions; use pull_request)"
          end

          filter_keys = %w[branches branches-ignore tags tags-ignore paths paths-ignore]
          filter_keys << 'types' if event == 'pull_request'

          filter_keys.each do |k|
            next unless ev.key?(k)

            v = ev[k]
            if k == 'types' && event == 'pull_request'
              if !v.is_a?(Array) || v.empty?
                trigger_filter_violations << "#{f}: on.pull_request.types must be a non-empty array of event type names"
              elsif v.any? { |x| !x.is_a?(String) || x.strip.empty? }
                trigger_filter_violations << "#{f}: on.pull_request.types entries must be non-empty strings"
              end
              next
            end

            if v.is_a?(String)
              trigger_filter_violations << "#{f}: on.#{event}.#{k} must not be empty" if v.strip.empty?
            elsif v.is_a?(Array)
              if v.empty?
                trigger_filter_violations << "#{f}: on.#{event}.#{k} must be a non-empty array or omit the key"
              elsif v.any? { |x| !x.is_a?(String) || x.strip.empty? }
                trigger_filter_violations << "#{f}: on.#{event}.#{k} entries must be non-empty strings"
              end
            else
              trigger_filter_violations << "#{f}: on.#{event}.#{k} must be a string or array of strings, got #{v.class}"
            end
          end
        end
      end

      if triggers.is_a?(Hash) && triggers.key?('merge_group')
        mg = triggers['merge_group']
        if !mg.is_a?(Hash)
          merge_group_violations << "#{f}: on.merge_group must be a mapping"
        elsif !mg.key?('types')
          merge_group_violations << "#{f}: on.merge_group must declare types: (e.g. [checks_requested])"
        else
          v = mg['types']
          if !v.is_a?(Array) || v.empty?
            merge_group_violations << "#{f}: on.merge_group.types must be a non-empty array of event type names"
          elsif v.any? { |x| !x.is_a?(String) || x.strip.empty? }
            merge_group_violations << "#{f}: on.merge_group.types entries must be non-empty strings"
          end
        end
      end

      if triggers.is_a?(Hash) && triggers.key?('schedule')
        sch = triggers['schedule']
        unless sch.is_a?(Array) && !sch.empty?
          schedule_shape_violations << "#{f}: on.schedule must be a non-empty array of { cron: \"...\" } entries"
        else
          sch.each_with_index do |entry, i|
            unless entry.is_a?(Hash)
              schedule_shape_violations << "#{f}: on.schedule[#{i}] must be a mapping with cron:"
              next
            end
            unless entry.key?('cron')
              schedule_shape_violations << "#{f}: on.schedule[#{i}] must declare cron:"
              next
            end
            c = entry['cron']
            unless c.is_a?(String) && !c.strip.empty?
              schedule_shape_violations << "#{f}: on.schedule[#{i}].cron must be a non-empty string"
              next
            end
            n = c.strip.split(/\s+/).size
            cron_violations << "#{f} (expected 5 cron fields, got #{n}: #{c.strip.inspect})" unless n == 5
          end
        end
      end

      if data.key?('concurrency')
        co = data['concurrency']
        if co.nil?
          concurrency_violations << "#{f}: concurrency must not be null (omit the key or provide group:)"
        elsif !co.is_a?(Hash)
          concurrency_violations << "#{f}: concurrency must be a mapping (group + optional cancel-in-progress)"
        else
          unless co.key?('group')
            concurrency_violations << "#{f}: concurrency must declare group:"
          else
            g = co['group']
            unless g.is_a?(String) && !g.strip.empty?
              concurrency_violations << "#{f}: concurrency.group must be a non-empty string"
            end
          end
          if co.key?('cancel-in-progress')
            cip = co['cancel-in-progress']
            unless cip == true || cip == false
              concurrency_violations << "#{f}: concurrency.cancel-in-progress must be true or false, got #{cip.inspect}"
            end
          end
        end
      end

      jobs = data['jobs']
      unless jobs.is_a?(Hash) && !jobs.empty?
        jobs_violations << f
        next
      end

      jobs.each do |job_name, job|
        next unless job.is_a?(Hash)

        jid = job_name.to_s
        job_id_violations << "#{f}: invalid job id #{job_name.inspect}" unless jid.match?(job_id_ok)

        reusable_caller = job.key?('uses') && !job.key?('steps')
        if job.key?('timeout-minutes')
          t = job['timeout-minutes']
          unless t.is_a?(Integer) && t >= 1 && t <= 360
            timeout_violations << "#{f} (job: #{job_name}): timeout-minutes must be integer 1..360 (GitHub-hosted max), got #{t.inspect}"
          end
        elsif !reusable_caller
          timeout_violations << "#{f} (job: #{job_name}): missing timeout-minutes"
        end

        if job.key?('steps') && !job.key?('uses') && !job.key?('runs-on')
          runs_on_violations << "#{f} (job: #{job_name})"
        end

        if job.key?('uses') && job['uses'].is_a?(String)
          u = job['uses']
          if u.start_with?('./')
            if u.include?('..')
              local_uses_violations << "#{f} (job: #{job_name}): job uses: path must not contain .. (#{u.inspect})"
            elsif !u.match?(local_reusable_uses_ok)
              local_uses_violations << "#{f} (job: #{job_name}): local reusable workflow must be ./.github/workflows/<file>.yml|.yaml (#{u.inspect})"
            end
          end
        end
      end
    rescue StandardError => e
      warn "error: #{f}: #{e.class}: #{e.message}"
      failed << f
    end
  end

  unless failed.empty?
    warn "YAML parse failures: #{failed.join(', ')}"
    exit 1
  end

  unless name_violations.empty?
    warn 'error: Every workflow must set a non-empty name: string:'
    name_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  duplicate_name_files = name_to_files.select { |_n, fs| fs.size > 1 }
  unless duplicate_name_files.empty?
    warn 'error: Each workflow name: must be unique across .github/workflows (duplicate display names):'
    duplicate_name_files.each do |nm, fs|
      warn "  #{nm.inspect}:"
      fs.each { |path| warn "    #{path}" }
    end
    exit 1
  end

  unless permissions_violations.empty?
    warn 'error: Every workflow must declare a top-level permissions: block:'
    permissions_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless permissions_shape_violations.empty?
    warn 'error: workflow permissions must be a mapping (e.g. contents: read), {}, or read-all / write-all:'
    permissions_shape_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless run_name_violations.empty?
    warn 'error: run-name must be a non-empty string when set:'
    run_name_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless top_level_env_violations.empty?
    warn 'error: top-level env: must be a mapping (not null) when set:'
    top_level_env_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless defaults_violations.empty?
    warn 'error: top-level defaults: must be a mapping; defaults.run optional shell:/working-directory: must be non-empty strings:'
    defaults_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless trigger_violations.empty?
    warn 'error: Every workflow must set a non-empty on: trigger (use quoted \'on\' in YAML if needed):'
    trigger_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless workflow_run_violations.empty?
    warn 'error: on.workflow_run must include workflows: (non-empty string array) and types: (non-empty string array):'
    workflow_run_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless workflow_dispatch_violations.empty?
    warn 'error: on.workflow_dispatch.inputs must be well-formed (choice requires options:; explicit type: must be valid):'
    workflow_dispatch_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless workflow_call_violations.empty?
    warn 'error: on.workflow_call inputs/secrets must be well-formed (typed inputs; secrets.required boolean when set):'
    workflow_call_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless trigger_filter_violations.empty?
    warn 'error: on.push / on.pull_request filters (branches, paths, tags, types, …) must be non-empty strings or arrays of non-empty strings; on.push must not use types::'
    trigger_filter_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless merge_group_violations.empty?
    warn 'error: on.merge_group must declare types: as a non-empty array of non-empty strings (merge queue):'
    merge_group_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless concurrency_violations.empty?
    warn 'error: When concurrency: is set, use a mapping with group: (non-empty string); cancel-in-progress must be boolean if present:'
    concurrency_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless jobs_violations.empty?
    warn 'error: Every workflow must define a non-empty jobs: map:'
    jobs_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless schedule_shape_violations.empty?
    warn 'error: on.schedule must be a non-empty array; each item needs a non-empty cron: string:'
    schedule_shape_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless cron_violations.empty?
    warn 'error: GitHub Actions schedule cron must have exactly 5 fields (minute hour day month weekday):'
    cron_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless newline_violations.empty?
    warn 'error: Every workflow file must end with a newline character:'
    newline_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless bom_violations.empty?
    warn 'error: Workflow files must not start with a UTF-8 BOM (remove EF BB BF bytes):'
    bom_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless job_id_violations.empty?
    warn 'error: Job ids must start with a letter or underscore and use only letters, digits, hyphens, underscores:'
    job_id_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless local_uses_violations.empty?
    warn 'error: Job-level uses: ./... must reference a workflow file under .github/workflows/ (no .. in path):'
    local_uses_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless timeout_violations.empty?
    warn 'error: Every workflow job must set timeout-minutes to an integer from 1 to 360 (GitHub-hosted):'
    timeout_violations.each { |v| warn "  #{v}" }
    exit 1
  end

  unless runs_on_violations.empty?
    warn 'error: Jobs with steps must set runs-on (reusable-workflow callers use uses: instead of steps):'
    runs_on_violations.each { |v| warn "  #{v}" }
    exit 1
  end
end
